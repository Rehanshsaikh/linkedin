import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import uploadFile from '@salesforce/apex/UploadFileConroller.uploadFile';

export default class UploadFile extends LightningElement {
    @api recordId

    connectedCallback() {
        console.log('this.recordId '+ this.recordId);
    }

    openfileUpload(event) {
        const files = event.target.files; // Capture the files array

        // Function to read the file as a base64 encoded string
        const readFile = (item) => {
            return new Promise((resolve, reject) => {
                let tempObj = {};
                tempObj["fileName"] = item.name;
                tempObj["fileType"] = item.type;
                const reader = new FileReader();

                // On successful read
                reader.onload = () => {
                    tempObj["fileContents"] = reader.result.split(',')[1]; // Extract the base64 encoded content
                    resolve(tempObj); // Resolve the promise with the file object
                };

                // On error
                reader.onerror = (error) => reject(error); // Reject the promise in case of error

                reader.readAsDataURL(item); // Read the file as a base64 encoded Data URL
            });
        };

        // Function to process the files and upload them
        const processFilesAndUpload = async () => {
            try {
                const fileList = await Promise.all(
                    Array.from(files).map((item) => readFile(item))
                ); // Process each file using readFile()

                console.log('File List: ' + JSON.stringify(fileList));

                // Call Apex to upload the files
                const result = await uploadFile({ recordId: this.recordId, fileObj: fileList });
                console.log('File uploaded successfully: ' + JSON.stringify(result));
                 this.toast('File Upload Success', 'Files were uploaded successfully', 'success');
                  window.alert('File uploaded successfully!');
                  window.location.reload();

            } catch (error) {
                console.log('Error message: ' + error.message);
                console.log('Error details: ' + JSON.stringify(error));
            }
        };

        // Call the processing and upload function
        processFilesAndUpload();
    }

    toast(title, message, variant = 'success') {
        const toastEvent = new ShowToastEvent({
            title: title,  // Title of the toast
            message: message,  // Message in the toast
            variant: variant,  // Can be 'success', 'error', 'warning', 'info'
        });
        this.dispatchEvent(toastEvent); // Fire the toast event
    }
}