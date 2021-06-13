import { ISkill } from './../ISkill';
import { EmployeeServiceService } from './../../employee-service.service';
import { IEmployee } from './../IEmployee';
import { CustomValidator } from './../../shared/custom.validator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm : FormGroup;
  id : number ;
  editEmployee : any;
  pageTitle : string;
  formErrors : any = {
    
  };
  validationMessages : any = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain' : 'Domain should be dell.com'
    },
    'confirmEmail': {
       'required' : 'Confirm email is required'
    },
    'emailGroup' : {
      'mismatch' : 'Email and confirm email don`t match'
    },
    'phone': {
      'required': 'Phone number is required.'
    }
  };
  constructor(private fb : FormBuilder, private _route : ActivatedRoute , private _empService : EmployeeServiceService,
              private _router : Router) { 
    

    this.employeeForm  = this.fb.group({
      fullName : ['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
      contactPreference : ['email'],
      emailGroup : this.fb.group({
        email : ['',[Validators.required,CustomValidator.emailDomain('dell.com')]],
        confirmEmail : ['',[Validators.required]]
      },{ validator : mismatchEmail}),     
      phone : [''],
      skills : this.fb.array([
        this.addSkillFormGroup()
      ])
    })

    this.employeeForm.valueChanges.subscribe((data) =>{
      this.logKeyValuePair(this.employeeForm);
    })

    this.employeeForm.get('contactPreference')?.valueChanges.subscribe((data)=>{
      if(data == 'phone'){
        this.employeeForm.get('phone')?.setValidators(Validators.required);

      }else{
        this.employeeForm.get('phone')?.clearValidators()
      }
      this.employeeForm.get('phone')?.updateValueAndValidity();
    })
    
  }

  get skills(){
    return (<FormArray>this.employeeForm.get('skills')).controls
  }
  ngOnInit(): void {

    this._route.paramMap.subscribe( (param)=> {
      if(param.has('id')){
        this.pageTitle = 'Edit Employee'
        this.id = <number>(param.get('id') as unknown);
         this.getEmployeeDetail(this.id);
      }
      else{
        this.pageTitle = 'Create Employee'
      }
      
    })
     

  }

  getEmployeeDetail(id :any){
    this._empService.getEmployeeById(id)
      .subscribe( (data)=> {
        this.editEmployee = data
        this.editEmployeeData(this.editEmployee)
        
      },
      (err : any) =>{ console.log("afdsf") })
  }

  editEmployeeData(employee : IEmployee){
    this.employeeForm.patchValue({
      fullName : employee.fullName,
      
      contactPreference : employee.contactPreference,
      phone : employee.phone,
      emailGroup : {
        email: employee.email,
        confirmEmail : employee.email
      }
      })

      this.employeeForm.setControl('skills',this.setExistingSkills(employee.skills))
  }

  setExistingSkills(skillSets : ISkill[]) : FormArray{
      const formArray = new FormArray([]);
      skillSets.forEach( s=> {
        formArray.push(this.fb.group({
          skill : s.skill,
          experienceInYears : s.experienceInYears,
          proficiency : s.proficiency
        }))
      })
      return formArray;
  }

  deleteSkill(i : number){
    (<FormArray>this.employeeForm.get('skills')).removeAt(i);
    this.employeeForm.get('skills')?.markAsDirty();
    console.log(this.employeeForm)
  }

  addSkillFormGroup(){
    return this.fb.group({
      skill : ['',Validators.required],
      experienceInYears : ['',Validators.required],
      proficiency : ['',Validators.required]
    })
  }

  logKeyValuePair(group :FormGroup = this.employeeForm) : void {
    const keys = Object.keys(group.controls);

    keys.forEach( (key : string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = "";
        if(abstractControl && abstractControl.invalid && (abstractControl.dirty || abstractControl.touched )){
          const messages = this.validationMessages[key];
            for(const errorKey in abstractControl?.errors){
              if(errorKey){
                
                this.formErrors[key] += messages[errorKey];

              }
            }

        }

      if(abstractControl instanceof FormGroup){
      this.logKeyValuePair(abstractControl);
      }
      
    }) 
    
  }

  get fullName(){
    return this.employeeForm.get('fullName');
  }

  onAddSkill(){
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup())
  }

  onLoad(){
    // this.employeeForm.setValue({
    //   fullName : 'Akash',
    //   email : 'kashyap@gmail.com',
    //   skills : {
    //     skill : 'Angular',
    //     experienceInYears : 3,
    //     proficiency : 'intermediate'
    //   }
    // })
    // this.logKeyValuePair(this.employeeForm);
    // console.log(this.formErrors )

    const formArray = this.fb.array([
      new  FormControl('john'),
      new  FormControl('won'),
      new FormGroup({
        country : new FormControl('eam')
      }),
      new FormArray([])	

    ])
    console.log(formArray.at(1),formArray.setControl(0,new FormControl('insertion')))
      for(let con of formArray.controls){
          if(con instanceof FormControl){
            console.log(`Form control : ${con.value}`)
          }
          else if(con instanceof FormGroup){
            console.log(`Form group : ${con}`)
          }
          else if(con instanceof FormArray){
            console.log(`Form Array : ${con}`)
          }
      }
  }

  onPatch(){
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      fullName : 'Akash',
      email : 'kashyap@gmail.com'
    })
  }

  onSubmit(val : any){
    
    val.id = this.id ;
    val.email = val.emailGroup.email;
    delete val.emailGroup;

    if(val.id){
      this._empService.updateEmployee(val)
     .subscribe( ()=> {
      this._router.navigate(['/list'])
     },
     (err)=> {
       alert("We ran into error");
       this._router.navigate(['/list'])
     })
    }
    else{
      this._empService.save(val)
        .subscribe(()=>{
          this._router.navigate(['/list'])
        },
        (err)=>{
          alert(err);
          this._router.navigate(['/list'])
        })
    }
    
    
  }



}

function mismatchEmail(group : AbstractControl) : { [key : string] : any} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if(group.dirty && emailControl?.value.toLowerCase() !== confirmEmailControl?.value.toLowerCase() && confirmEmailControl?.dirty && confirmEmailControl.value !== ''){
      return { 'mismatch' : true}
  }
  return null;
}




