import OpenAI from "openai"


let openai: OpenAI|null = null

if(process.env.OPENAI_API_KEY){
  openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
}

export async function createThankYou(question: string, answer: string) :Promise<string>{
  let res: string = 'Thank you for voting!'

  if(openai){
    const completion = await openai.completions.create({
      max_tokens: 64, 
      temperature: 0.9, 
      model: 'text-davinci-003',
      prompt: `Give a short snarky thank you to a person registering a vote in a poll.\nQuestion was: ${question}\nAnswer was: ${answer}`
    })

    res = completion.choices[0].text.replace(/^"/m, "").replace(/"$/m, "");  
  }
  
  return res
}