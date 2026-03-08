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
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Clients") // used for Swagger documentation grouping
@ApiBearerAuth() // indicates that this controller's endpoints require JWT authentication, and Swagger will include the necessary information for clients to provide a JWT token when testing the API.
@Controller("clients")
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: "create client" })
  @Post()
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    return this.clientsService.create({
      ...createClientDto,
    });
  }

  @ApiOperation({ summary: "get client by id" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.clientsService.findOne(id);
  }

  @ApiOperation({ summary: "get all clients for the authenticated user" })
  @Get()
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user.id);
  }

  @ApiOperation({ summary: "update client by id" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @ApiOperation({ summary: "delete client by id" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.clientsService.remove(id);
  }
}
