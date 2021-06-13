import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { IEmployee } from './employee/IEmployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  url : string = 'http://localhost:3000/employees';

  constructor(private _httpClient : HttpClient) { }

  getEmployee() : Observable<IEmployee[]> {
    //return of(this.listEmployees);
    return this._httpClient.get<IEmployee[]>(this.url)
          .pipe(catchError(this.handleError))
        
  }

  private handleError(errorResponse : HttpErrorResponse) {
    if(errorResponse.error instanceof ErrorEvent){
      console.error('Client side Error : ',errorResponse.error.message)
    }
    else{
      console.error('Server side error: ',errorResponse)
    }
    return throwError('We are looking into it');
  }

  getEmployeeById(id : number) : Observable<IEmployee>  {
    //return this.listEmployees[id-1];

    return this._httpClient.get<IEmployee>(`${this.url}\\${id}`)
            .pipe(catchError(this.handleError));
  }

  save(employee : IEmployee){

    return this._httpClient.post<IEmployee>(this.url,employee,{
      headers : new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    })
    .pipe(catchError(this.handleError));
  } 

  updateEmployee(employee : IEmployee){

    return this._httpClient.put<IEmployee>(`${this.url}\\${employee.id}`,employee,{
      headers : new HttpHeaders({
        'Content-Type' : 'application/json'
      })
    })
    .pipe(catchError(this.handleError));  
  } 

  deleteEmployee(id : number){

    return this._httpClient.delete<IEmployee>(`${this.url}\\${id}`)
    .pipe(catchError(this.handleError));  
  } 
  
}

