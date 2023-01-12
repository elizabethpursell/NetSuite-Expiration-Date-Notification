# NetSuite-Expiration-Date-Notification
## Project Overview
<img width="635" alt="almostExpiredEmail" src="https://user-images.githubusercontent.com/94419306/212152431-157d6996-f688-4d61-988c-fa02a65a37ab.png">

### Purpose
This project sends an email listing the inventory items, including their lot numbers, bin numbers, locations, and expiration dates, that will expire within the next two weeks. It is a scheduled script that runs every Monday at 9am. This notification allows the Supply Chain team to verify the items' expiration dates before they are set to expired.
### Features
- Automated Emails
- Saved Searches and Summary Types
### Prerequisites
- SuiteScript/JavaScript
  - Modules: N/search, N/record, N/email
  - SuiteScript Types: Scheduled Script
  - API Version: 2.x
  - JSDoc Tags
- Saved Searches
## Project Setup
### Saved Searches
Be sure to note the saved search ID.
- **Search for Expiration Recertification:**
    - **Function:** collects all the inventory details with expiration dates within the next two weeks
    - **Search Type:** Inventory Detail
    - **Criteria:** Expiration Date is within 0 days ago and 2 weeks from now, Inventory Number: Available is greater than 0, Status is Good, Item: Type is Inventory Item
    - **Result Columns:** Internal ID, Status, Item, Number, Expiration Date
    - **Summary Types:** Group the following fields: Status, Item, Number, Expiration Date
    - **Sort By:** Expiration Date, Number, Bin Number
    - **Permissions:** Public
### Uploading to NetSuite
- **Adding a SuiteScript to the File Cabinet:** navigate Customization>Scripting>Scripts>New; next to the "Script File" dropdown, press the plus sign to upload a new SuiteScript file; select the NetSuite folder that you want to store the SuiteScript files in; under "Select File," press the "Choose File" button; select the SuiteScript file that you want to upload and press open; save and press the blue "Create Script Record" button; name the file, input a relevant ID, and save
## File Descriptions
### send_expiration_email.js
- **Programming Languages:** JavaScript, SuiteScript 2.0
- **SuiteScript Type:** Scheduled Script, execute
- **Description:** sends email of list of inventory items that expire within two weeks
- **Catering the Code to Your NetSuite:**
    - Changing the Saved Search IDs: whenever there is a search load instance (search.load), change the parameter "id" to the correct search ID
    - Sending Email to Different Recipient: find where the email is sent (email.send) at the end of the program; change the "recipients" parameter to the correct email address; add more than one recipient by putting the emails as an array of strings
    - Changing the Email Sender: find where the email is send (email.send) at the end of the program; change the "author" parameter to the correct employee internal ID; find employee internal IDs by navigating Lists>Employees>Employees and locating the correct employee; can only choose one author for the email
- **Deploying SuiteScript:** go to the SuiteScript file; press the "Deploy Script" button; enter a name and relevant ID; change the status to "Testing"; press the blue "Save" button and choose "Save and Execute"; once the code has been tested, change the status to "Scheduled"; under "Execute As Role," choose "Administrator" so that the code will get full access to NetSuite and will not create any permissions errors; under the "Schedule" subtab, choose the schedule that the SuiteScript should execute on (Daily Event, Repeat every weekday, start time 8:00am)
<img width="950" alt="almost_expired_items" src="https://user-images.githubusercontent.com/94419306/210434445-fbf41838-e00f-49df-8c6a-78b527773dcf.png">

## References
### Helpful Links
- **SuiteScript 2.0:** https://docs.oracle.com/cd/E60665_01/netsuitecs_gs/NSAPI/NSAPI.pdf
- **SuiteScript Modules:** https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/set_1502135122.html
## Extra Tips
- Choose to execute as the administrator role when deploying the SuiteScripts to make sure everyone has full permissions
- Be sure to check the global permission in all of the saved searches
- Go back to the script deployments to check that their status is "Released" and that their audience includes all roles
