import { Component, OnInit, NgZone, ViewChild, ElementRef } from "@angular/core";
import { isAndroid } from "tns-core-modules/platform";
import { Page, WebView } from "tns-core-modules/ui";
import * as application from "tns-core-modules/application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import {exit} from 'nativescript-exit';




@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
    styleUrls: [ "./home.component.css" ]
})
export class HomeComponent implements OnInit {


    // @ts-ignore
    @ViewChild('webview') webview: ElementRef;


    private isStarted = true;
    private isFinish = false;
    private isError = false;



    constructor(private page: Page) {
        this.page.actionBarHidden = true;
    }



    ngOnInit(): void {

        if (!isAndroid) {
            return;
        }

    }




    onWebViewLoaded(webargs) {
        const webview = webargs.object;
        if (isAndroid) {
            webview.android.getSettings().setDisplayZoomControls(false);
        }

        application.android.on (
            AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                data.cancel = true;
                    if (webview != null) {
                        if (webview.canGoBack)
                            webview.goBack();
                        else
                            this.displayAlertDialog();
                    }
            });

    }



    onLoadStarted(args) {
        const page: Page = <Page>args.object;
        const vm = page.bindingContext;
        let message;
        if (!args.error) {
            message = `WebView started loading of ${args.url}`;
        } else {
            message = `Error loading  ${args.url} : ${args.error}`;
            this.isError = true;
            this.isStarted = false;
        }
        console.log(message);
    }



    onLoadFinished(args) {
        let message;
        if (!args.error) {
            message = `WebView finished loading of  ${args.url}`;
            this.isStarted = false;
            this.isError = false;
            this.isFinish = true;
        } else {
            message = `Error loading ${args.url} : ${args.error}`;
            this.isError = true;
            this.isStarted = false;
            this.isFinish = false;
        }
        console.log(message);
    }


    onBackPressed() {

        if (!isAndroid) {
            return;
        }


        const mywebview = <WebView>this.webview.nativeElement;

        application.android.on (
            AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
                data.cancel = true;
                if (mywebview.canGoBack)
                    mywebview.goBack();
                else
                    this.displayAlertDialog();
        });

    }




    displayAlertDialog() {

        let options = {
            title: "Confirmation",
            message: "Voulez-vous vraiment quitter l'application",
            okButtonText: "Oui",
            cancelButtonText: "Annuler",
        };

        // @ts-ignore
        confirm(options).then((result: boolean) => {
            console.log(result);
            if (result) {
                exit();
            }
        });


    }



}
