import { User } from "@/shared/types/User";
interface SignatureSectionProps {
  createdAt: string;
  firstName: User["firstName"];
  lastName: User["lastName"];
}

export default function SignatureSection({
  createdAt,
  firstName,
  lastName,
}: SignatureSectionProps) {
  return (
    <div>
      <h3 className="mb-3 text-lg tracking-wide font-now">
        AUTHORIZED SIGNATURE
      </h3>
      <div className="mb-5 text-[26px] font-eyesome-script">
        {firstName} {lastName}
      </div>
      <p className="text-sm font-tt-chocolates">
        Date:{" "}
        {new Date(createdAt)
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          .replace(/(\w+)\s(\d+)/, "$1, $2")}
      </p>
    </div>
  );
}
