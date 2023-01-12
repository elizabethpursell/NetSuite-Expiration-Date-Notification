define(['N/search', 'N/email', 'N/url'], function(search, email, url){
    /**
      * @NApiVersion 2.x
      * @NScriptType ScheduledScript
      */
    function execute(scriptContext) {
        const items = [];
        const lots = [];
        const dates = [];
        const urls = [];
        var emailBody = "";
        var expiredSearch = search.load({               //searches for inventory items that expire within 2 weeks
            id: 'customsearchalmost_expired'
        });
        expiredSearch.run().each(function(result){
            if(result != null && result != ''){
                var currentItem = result.getText({
                    name: "item",
                    summary: "GROUP"
                });
                var currentLot = result.getText({
                    name: "inventorynumber",
                    summary: "GROUP"
                });
                var lotId = result.getValue({
                    name: "inventorynumber",
                    summary: "GROUP"
                });
                var currentURL = url.resolveRecord({
                    recordType: "inventorynumber",
                    recordId: parseInt(lotId),
                    isEditMode: true
                });
                var currentDate = result.getValue({
                    name: "expirationdate",
                    summary: "GROUP"
                });
                items.push(currentItem);        //add data to arrays
                lots.push(currentLot);
                dates.push(currentDate);
                urls.push(currentURL);
            }
            return true;
        });
        log.error("Items", items);
        log.error("Lots", lots);
        log.error("Dates", dates);
        log.error("URLs", urls);
        if(items.length > 0){               //execute if there will be inventory that expires within two weeks
            emailBody = "<b>Please Recertify The Following Expiration Dates:</b><br><br>";
            for(var i = 0; i < items.length; i++){
                var currentItem = items[i].toString();
                var currentLot = lots[i].toString();
                var currentDate = dates[i].toString();
                var currentURL = urls[i].toString();
                emailBody += " - <b><a href=" + currentURL + ">" + currentItem + "</a></b>: Lot " + currentLot + " (Expires " + currentDate + ")<br>";
            }
            try{                    //try to send email
                email.send({
                    author: -5,		//internal ID of user
                    recipients: ["fakeemail@gmail.com"],
                    subject: "Ingredient Expiration Recertification",
                    body: emailBody
                });
                log.error("Email", emailBody);
                log.error("Email Sent");
            }
            catch(err){
                log.error("Email", emailBody);
                log.error("Email was not sent");
            }
        }
        log.error("Number of Ingredients that Expire Within 2 Weeks", items.length);      //log the number almost expired ingredients
    }
    return {
        execute: execute
    }
});
