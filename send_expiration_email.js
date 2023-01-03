define(['N/search', 'N/record', 'N/email'], function(search, record, email){
    /**
      * @NApiVersion 2.x
      * @NScriptType ScheduledScript
      */
    function execute(scriptContext) {
        const items = [];
        const lots = [];
        const dates = [];
        const bins = [];
        const locations = [];
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
                var currentDate = result.getValue({
                    name: "expirationdate",
                    summary: "GROUP"
                });
                var currentBin = result.getText({
                    name: "binnumber",
                    summary: "GROUP"
                });
                var currentLocation = result.getText({
                    name: "location",
                    summary: "GROUP"
                });
                bins.push(currentBin);          //add data to array
                items.push(currentItem);
                lots.push(currentLot);
                dates.push(currentDate);
                locations.push(currentLocation);
            }
            return true;
        });
        log.error("Items", items);
        log.error("Lots", lots);
        log.error("Dates", dates);
        log.error("Bins", bins);
        log.error("Locations", locations);
        if(items.length == 0){            //execute if no inventory will be expired within two weeks
            emailBody = "No inventory will expire within two weeks.";
        }
        else{               //execute if there will be inventory that expires within two weeks
            emailBody = "<b>The Following Inventory Will Expired Within Two Weeks:</b><br><br>";
            for(var i = 0; i < items.length; i++){
                var currentItem = items[i].toString();
                var currentLot = lots[i].toString();
                var currentBin = bins[i].toString();
                var currentDate = dates[i].toString();
                var currentLocation = locations[i].toString();
                emailBody += " - <b>" + currentItem + "</b>: Location: " + currentLocation + ", Lot " + currentLot + ", Bin: " + currentBin + " (Expires " + currentDate + ")<br>";
            }
            emailBody += "<br>Verify the expiration dates with their vendors."
        }
        var senderRecord = record.load({		//check if desired email sender is inactive
            type: record.Type.EMPLOYEE,
            id: 2655			//internal id of user to try to send email from
        });
        var isInactive = senderRecord.getValue({
            fieldId: "isinactive"
        });
        if(isInactive == true){			//send email to/from Tim if user inactive
            emailBody = "The person who this email was originally sent to no longer has access to NetSuite<br><br>" + emailBody;
            log.error("Email", emailBody);
            log.error("Email Sent1");
            email.send({
                author: -5,			//internal ID of user
                recipients: "troth@stuffedpuffs.com",
                subject: "Weekly Inventory Expiration Update -- Error",
                body: emailBody
            });
        }
        else{            //send email if user active
            email.send({
                author: 2655,		//internal ID of user
                recipients: "epursell@stuffedpuffs.com",
                subject: "Weekly Inventory Expiration Update",
                body: emailBody
            });
            log.error("Email", emailBody);
            log.error("Email Sent2");
        }
        log.error("Number of Items that Expired Within 2 Weeks", items.length);      //log the number of inventory statuses changed
    }
    return {
        execute: execute
    }
});