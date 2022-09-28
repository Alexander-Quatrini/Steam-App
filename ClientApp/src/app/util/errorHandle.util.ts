import { HttpErrorResponse } from "@angular/common/http";
import { Constants } from "./constants.util";


export function handleError(error: HttpErrorResponse): void{
    if(error.status == 401){
      window.location.href = Constants.apiUrl + ":" + Constants.apiPort + "/api/authentication/signin";
    } else{
      console.log(error.message);
    }
}