package com.email.writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
public class EmailGenratorController {
    private final EmailgeneratorService emailgeneratorService;

    public EmailGenratorController(EmailgeneratorService emailgeneratorService) {
        this.emailgeneratorService = emailgeneratorService;
    }


    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest)
    {
        String response = emailgeneratorService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
