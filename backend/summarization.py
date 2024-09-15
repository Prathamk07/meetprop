import os
from flask import app, jsonify, request
from transformers import pipeline, TFBartForConditionalGeneration, BartTokenizer
import tensorflow as tf

def summarize_text_advanced(text):
    """Summarize the transcribed text using Hugging Face summarization with TensorFlow."""
    try:
        # Initialize the tokenizer and model
        tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
        model = TFBartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")

        # Tokenize the input text
        inputs = tokenizer.encode("summarize: " + text, return_tensors="tf", max_length=1024, truncation=True)

        # Generate the summary
        summary_ids = model.generate(inputs, max_length=1000, min_length=120, length_penalty=2.0, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        
        return summary

    except Exception as e:
        # Print the error message and return a fallback value
        print(f"An error occurred: {e}")
        return "Summary could not be generated"


