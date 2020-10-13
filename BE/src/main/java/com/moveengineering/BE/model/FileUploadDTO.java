package com.moveengineering.BE.model;

import org.springframework.web.multipart.MultipartFile;

public class FileUploadDTO {
    MultipartFile file;
    String senderName;
    public FileUploadDTO(){}

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

}
