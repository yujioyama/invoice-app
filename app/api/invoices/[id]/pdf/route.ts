import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Browser } from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_PAYLOAD_STORAGE_KEY = "invoice_pdf_payload_v1";

const isVercelRuntime =
  process.env.VERCEL === "1" ||
  process.env.VERCEL === "true" ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

async function launchBrowser(): Promise<Browser> {
  const executablePathFromEnv =
    process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_EXECUTABLE_PATH;

  if (isVercelRuntime) {
    const puppeteerCoreImport = await import("puppeteer-core");
    const puppeteerCore = puppeteerCoreImport.default ?? puppeteerCoreImport;
    const chromiumImport = await import("@sparticuz/chromium");
    const chromium = chromiumImport.default ?? chromiumImport;

    const executablePath =
      executablePathFromEnv ?? (await chromium.executablePath());

    const headless: boolean | "shell" | undefined =
      typeof chromium.headless === "string"
        ? chromium.headless === "shell"
          ? "shell"
          : true
        : chromium.headless;

    return (await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless,
    })) as unknown as Browser;
  }

  const puppeteerImport = await import("puppeteer");
  const puppeteer = puppeteerImport.default ?? puppeteerImport;

  return await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: executablePathFromEnv,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const id = params.id;
  if (!id) {
    return new NextResponse("Invalid invoice id", { status: 400 });
  }

  const origin = req.nextUrl.origin;
  const url = `${origin}/invoices/${id}`;
  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => {
        const [name, ...rest] = c.trim().split("=");
        return {
          name,
          value: rest.join("="),
          domain: new URL(origin).hostname,
          path: "/",
        };
      });
      await page.setCookie(...cookies);
    }
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#invoice-pdf", { timeout: 30_000 });
    await page.evaluate(() => {
      const el = document.querySelector("#invoice-pdf");
      if (!el) throw new Error("#invoice-pdf not found");
      document.body.innerHTML = (el as HTMLElement).outerHTML;
      document.documentElement.style.background = "#ffffff";
      document.body.style.background = "#ffffff";
      document.body.style.margin = "0";
    });
    await page.addStyleTag({
      content: `
        #invoice-pdf {
          box-shadow: none !important;
          filter: none !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 297mm !important;
        }
        #invoice-pdf .invoice-body { flex: 1 1 auto !important; }
        #invoice-pdf .invoice-footer { margin-top: auto !important; }
      `,
    });
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
    await page.emulateMediaType("print");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    await page.close();
    const pdfBytes = new Uint8Array(pdfBuffer.byteLength);
    pdfBytes.set(pdfBuffer);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice-" + id + ".pdf",
      },
    });
  } catch (err) {
    // Detailed error logging for debugging
    console.error("PDF generation error:", err);
    let errorMessage = "Failed to generate PDF";
    if (err instanceof Error) {
      errorMessage += ": " + err.message;
    } else if (typeof err === "string") {
      errorMessage += ": " + err;
    }
    return new NextResponse(errorMessage, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}

type PdfPayload = {
  invoice: {
    name: string;
    createdAt: string;
    currency: string;
    language: string;
  };
  tasks: unknown[];
  client: unknown | null;
  user: unknown | null;
  bankAccount: unknown | null;
};

function isPdfPayload(value: unknown): value is PdfPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!v.invoice || typeof v.invoice !== "object") return false;
  const invoice = v.invoice as Record<string, unknown>;
  return (
    typeof invoice.name === "string" &&
    typeof invoice.createdAt === "string" &&
    typeof invoice.currency === "string" &&
    typeof invoice.language === "string" &&
    Array.isArray(v.tasks)
  );
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const id = params.id;
  if (!id) {
    return new NextResponse("Invalid invoice id", { status: 400 });
  }

  let payloadRaw: unknown;
  try {
    payloadRaw = await req.json();
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  if (!isPdfPayload(payloadRaw)) {
    return new NextResponse("Invalid PDF payload", { status: 400 });
  }

  const origin = req.nextUrl.origin;
  const url = `${origin}/invoices/preview?pdf=1`;

  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    const payloadJson = JSON.stringify(payloadRaw);
    await page.evaluateOnNewDocument(
      (storageKey: string, json: string) => {
        try {
          window.localStorage.setItem(storageKey, json);
        } catch {
          // ignore
        }
      },
      PDF_PAYLOAD_STORAGE_KEY,
      payloadJson,
    );

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#invoice-pdf", { timeout: 60_000 });

    await page.evaluate(() => {
      const el = document.querySelector("#invoice-pdf");
      if (!el) throw new Error("#invoice-pdf not found");
      document.body.innerHTML = (el as HTMLElement).outerHTML;
      document.documentElement.style.background = "#ffffff";
      document.body.style.background = "#ffffff";
      document.body.style.margin = "0";
    });
    await page.addStyleTag({
      content: `
        #invoice-pdf {
          box-shadow: none !important;
          filter: none !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 297mm !important;
        }
        #invoice-pdf .invoice-body { flex: 1 1 auto !important; }
        #invoice-pdf .invoice-footer { margin-top: auto !important; }
      `,
    });
    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    await page.close();

    const pdfBytes = new Uint8Array(pdfBuffer.byteLength);
    pdfBytes.set(pdfBuffer);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice-" + id + ".pdf",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    let errorMessage = "Failed to generate PDF";
    if (err instanceof Error) {
      errorMessage += ": " + err.message;
    } else if (typeof err === "string") {
      errorMessage += ": " + err;
    }
    return new NextResponse(errorMessage, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
