package com.email_project2.email_writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailgeneratorService {
    private final WebClient webClient;
    //to get it from application resources(@Value())
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailgeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest)
    {
        //build the prompt
        String prompt = buildPrompt(emailRequest);


        //craft a request **(because the request is in the specific format)
        Map<String , Object> requestBody = Map.of(
                "contents",new Object[]{
                        Map.of("parts",new Object[]{
                                Map.of("text",prompt)
                        })
                }
        );


        //do request and get the response
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type" , "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();


        //extract response and return response
        return extractResponseContent(response);

    }

    private String extractResponseContent(String response) {
        try{
            //convert the json data to java object and vice versa
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode  = mapper.readTree(response);//(mapper.readTree(response))->convert the jason response into tree like structure
            return rootNode.path("candidates")
                    .get(0)//as candidate is array so select first field
                    .path("content")//navigate to content in the tree
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();//converting to string
        } catch (Exception e) {
            return "error:"+e.getMessage();
        }
    }




    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("please generate the professional resoponse for the following email,dont add the subject line and dont follow format, ");
        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty())
        {
            prompt.append("follow ").append(emailRequest.getTone()).append("tone");
        }
        prompt.append("\n original email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }

}
