import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Invoices")
@ApiBearerAuth()
@Controller("invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiOperation({ summary: "create invoice" })
  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req: any) {
    const userId = req.user.id;
    return this.invoicesService.create({ ...createInvoiceDto, userId });
  }

  @ApiOperation({ summary: "get invoice by id" })
  @Get(":id")
  findOne(@Param("id") id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.invoicesService.findOne(id, userId);
  }

  @ApiOperation({ summary: "get all invoices for the authenticated user" })
  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.invoicesService.findAll(userId);
  }

  @ApiOperation({ summary: "update invoice by id" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.invoicesService.update(id, userId, updateInvoiceDto);
  }

  @ApiOperation({ summary: "delete invoice by id" })
  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.invoicesService.remove(id, userId);
  }
}
