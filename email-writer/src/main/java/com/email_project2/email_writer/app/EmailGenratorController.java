package com.email_project2.email_writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
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

