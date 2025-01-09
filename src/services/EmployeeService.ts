import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { BadRequest } from "../errors/BadRequest";
import { NotFound } from "../errors/NotFound";
import { IEmployeeRepository } from "../interfaces/IEmployeeRepository";
import { IEmployeeService } from "../interfaces/IEmployeeService";
import { ILoggerService } from "../interfaces/ILoggerService";
import {
  CreateEmployee,
  GetEmployeeService,
  UpdateEmployee,
} from "../types/Employee";

@injectable()
export class EmployeeService implements IEmployeeService {
  private _loggerService: ILoggerService;
  private _employeeRepository: IEmployeeRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.EmployeeRepository) employeeRepository: IEmployeeRepository
  ) {
    this._employeeRepository = employeeRepository;
    this._loggerService = loggerService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getEmployee(id: number): Promise<GetEmployeeService> {
    return this._employeeRepository.getEmployee(id);
  }

  async createEmployee(employee: CreateEmployee): Promise<GetEmployeeService> {
    const takenEmailId = "jay.amrutiya@dntinfotech.com";

    if (takenEmailId === employee.emailId) {
      throw new BadRequest("This emailid already in use.");
    }

    return this._employeeRepository.createEmployee(employee);
  }

  async updateEmployee(
    id: number,
    employee: UpdateEmployee
  ): Promise<GetEmployeeService> {
    const getEmployee = await this._employeeRepository.getEmployee(id);

    if (getEmployee.id !== id) {
      throw new NotFound("Employee not found.");
    }

    const takenEmailId = "jay.amrutiya@dntinfotech.com";

    if (takenEmailId === employee.emailId) {
      throw new BadRequest("This emailid already in use.");
    }

    return this._employeeRepository.updateEmployee(id, employee);
  }
}
