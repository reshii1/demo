from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
import pandas as pd
from pathlib import Path
import traceback
import os

# openAI key
client = OpenAI(api_key="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")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/oee")
async def get_oee():
    # path is relative to this file! shift_report.xlsx must be in the same folder as main.py for backend to work
    base = os.path.dirname(os.path.realpath(__file__))
    xlsx = os.path.join(base, "shift_report.xlsx")
    df = pd.read_excel(xlsx, engine="openpyxl")
    df = df[["Shift Date", "Shift Actual OEE"]]
    df.columns = ["date", "oee"]
    df["date"] = df["date"].dt.strftime("%Y-%m-%d")
    return df.to_dict(orient="records")



class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(payload: QuestionRequest):
    question = payload.question

    if not question:
        raise HTTPException(status_code=400, detail="No question received")

    try:
        #excel file
        file_path = Path(__file__).parent / "shift_report.xlsx"
        if not file_path.exists():
            raise FileNotFoundError(f"Excel file not found at: {file_path.resolve()}")

        df = pd.read_excel(file_path)
        df.columns = df.columns.str.strip()
        df_summary = df.head(10).to_string(index=False)

        response = client.chat.completions.create(
            model="gpt-4.1-nano", 
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a shift report assistant. Answer questions using the following data: \n\n"
                        f"{df_summary}\n\n"
                        "Only include relevant issues, product transitions, and the machines or processes involved. "
                        "Do not describe each day. Focus on summarizing patterns like machine faults, product changes, and operator interventions. "
                        "Be concise and avoid unnecessary details. Preferably within 100 words, but can go above if necessary to answer the question. "
                        "Be aware that the data may have inconsistencies, missing values, spelling mistakes, or other errors. "
                        "Use different categories to summarize the data, such as: 'Machine issues', 'Quality issues', 'Product changes', etc."
                    )
                },
                {
                    "role": "user",
                    "content": question
                }
            ]
        )

        return {"answer": response.choices[0].message.content}

    except Exception as e:
        print("BACKEND ERROR:")
        traceback.print_exc()
        return JSONResponse(content={"answer": f"Error: {str(e)}"}, status_code=500)
