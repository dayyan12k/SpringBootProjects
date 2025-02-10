import React, { useState } from 'react'; // Import useState
import { CircularProgress, Container, Typography} from '@mui/material';
import { Box, TextField } from '@mui/material';
import { FormControl, Select, MenuItem ,InputLabel,Button} from '@mui/material';


import './App.css'
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async() => {
    setLoading(true);
    setError('');
    try{
      const response = await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));

    }catch(error){
      setError('Failed to generate the reply!');
      console.error(error);

    }finally{
      setLoading(false);
    }
  };
  return (
    <>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Smart AI Email Reply Generator
      </Typography>
      
      <Box sx={{mx:3}}>
        <TextField
        fullWidth
        multiline
        rows={7}
        variant='outlined'
        label="YOUR EMAIL"
        value={emailContent||''}
        onChange={(e) => setEmailContent(e.target.value)}
        sx={{mb:3}}/>
          <FormControl fullWidth sx={{mb:2}}>
            <InputLabel>Tone(Optional)</InputLabel>
            <Select
            value={tone||''}
            label={"Tone (Optional)"}
            onChange={(e)=>setTone(e.target.value)}
            variant='filled'>
              <MenuItem value=""> None</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!emailContent||loading}
            fullWidth>
            {loading ? <CircularProgress size={23}/>:"Generate Reply"}
          </Button>
        
      </Box>
      {error &&(
        <Typography color='error' sx={{mb:2}}>
        {error}
      </Typography>
      )}
      {generatedReply &&(
        <Box sx={{mt:3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
          multiline
          fullWidth
          variant='outlined'
          value={generatedReply || ""}
          inputProps={{readOnly:true}}/>
          <Button
          variant='outlined'
          sx={{mt:2}}
          onClick={()=>navigator.clipboard.writeText(generatedReply)}>
            Copy to Clipboard</Button>
        </Box>
      )}

    </Container>
  </>
  
  )
}

export default App
