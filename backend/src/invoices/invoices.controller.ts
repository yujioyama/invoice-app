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
import {
  InvoicesService,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from "./invoices.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.invoicesService.findOne(id);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.invoicesService.findAll(userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.invoicesService.remove(id);
  }
}
