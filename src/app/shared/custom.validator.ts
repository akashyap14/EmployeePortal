import { AbstractControl } from "@angular/forms";

export class CustomValidator{

    static emailDomain(domainName :string) {

        return (control : AbstractControl) : { [key :string] : any}| null => {
          var emailText = control.value;
          var domain = emailText.substring(emailText.indexOf('@') + 1);
          
          if(domain.toLowerCase() !== '' && domain.toLowerCase() != domainName.toLowerCase()){
            
            return { 'emailDomain' : true}
          }
         
          return null;
          };
        
      }
}