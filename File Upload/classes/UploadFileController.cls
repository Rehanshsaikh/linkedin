public with sharing class UploadFileController {
    @AuraEnabled
    public static void uploadFile(String recordId, List<Map<String, String>> fileObj) {
        
        for(Map<String, String> singleFile : fileObj) {
            ContentVersion contentVersion = new ContentVersion();
            contentVersion.Title = singleFile.get('fileName');
            contentVersion.PathOnClient = singleFile.get('fileName');
            contentVersion.VersionData = EncodingUtil.base64Decode(singleFile.get('fileContents'));
            insert contentVersion;
            
            String conentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id].ContentDocumentId;
            
            // Link the document to the record
            ContentDocumentLink contentLink = new ContentDocumentLink();
            contentLink.ContentDocumentId = conentId;
            contentLink.LinkedEntityId = recordId;
            contentLink.ShareType = 'V';
            insert contentLink;
            
        }
      
    }
}