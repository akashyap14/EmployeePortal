import { IEmployee } from './../IEmployee';
import { EmployeeServiceService } from './../../employee-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {
  employees : IEmployee[] = [];
  constructor(private _employeeService : EmployeeServiceService,
              private _router : Router) { }

  ngOnInit(): void {
    this._employeeService.getEmployee()
    .subscribe((data)=> {
      this.employees = data;
    })
  }

  onEditEmployee(id : number){
    this._router.navigate(['/edit',id])
  }

}
