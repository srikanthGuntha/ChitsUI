import { Component, OnInit } from '@angular/core';
import { ChitsService } from "../../_services/getchitsdata.service";
import { LoaderService } from '../../_services/loader.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { MapErrorCodes } from '../../config/errorcodes';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  public chitsData: any = [];
  public selectedChitId: string = "";
  public showNoTransactionsText: string = "";
  public selectedChitsData: any = [];
  constructor(private authService: AuthenticationService,private chitsdataservice: ChitsService, private loaderService: LoaderService) { }
  ngOnInit() {
    this.loaderService.display(true);
    this.chitsdataservice.getPopulateChitData().subscribe(result => {
        if (result.success) {
          this.loaderService.display(false);
          let that = this;
          result.data.forEach(function(data){
            if (data.chitstatus) {
              that.chitsData.push(data);
            }
          });
          if (!this.chitsData.length) {
            this.showNoTransactionsText = "You have no active chits currently.";
          }
        } else {
          var code = result.code;
          this.loaderService.display(false);
          this.chitsData = [];
          this.showNoTransactionsText = MapErrorCodes[code] || "Error in fetching your chits data, try again after sometime.";
        }
      });
  }

  printReceipt(){
    let printContents, popupWin;
    printContents = document.getElementById('chit-details-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style></style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  public onChangeChit(event) {
    if (event !== "") {
    	let that = this;
    	this.chitsData.forEach(function(chit) {
    		if (chit.chit.chitid.chitid == event.chit.chitid.chitid) {
    			that.selectedChitsData = [];
    			that.selectedChitsData.push(chit);
    		}
    	});
    } else {
    	this.selectedChitsData = [];
    }
  }

}
