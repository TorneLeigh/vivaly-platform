#!/usr/bin/env python3

import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import os

def convert_markdown_to_pdf(markdown_file, output_pdf):
    """Convert markdown file to PDF with professional styling"""
    
    # Read the markdown file
    with open(markdown_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Convert markdown to HTML
    md = markdown.Markdown(extensions=['tables', 'toc', 'codehilite'])
    html_content = md.convert(markdown_content)
    
    # Create professional CSS styling
    css_style = """
    @page {
        size: A4;
        margin: 2cm;
        @top-center {
            content: "VIVALY Care Platform - Policies & Terms";
            font-size: 10pt;
            color: #666;
        }
        @bottom-center {
            content: "Page " counter(page) " of " counter(pages);
            font-size: 10pt;
            color: #666;
        }
    }
    
    body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        max-width: 100%;
    }
    
    h1 {
        color: #2c3e50;
        font-size: 24pt;
        font-weight: bold;
        margin-top: 30pt;
        margin-bottom: 20pt;
        page-break-before: always;
        border-bottom: 3pt solid #3498db;
        padding-bottom: 10pt;
    }
    
    h1:first-of-type {
        page-break-before: auto;
        text-align: center;
        font-size: 28pt;
        color: #2c3e50;
    }
    
    h2 {
        color: #34495e;
        font-size: 16pt;
        font-weight: bold;
        margin-top: 25pt;
        margin-bottom: 15pt;
        border-bottom: 1pt solid #bdc3c7;
        padding-bottom: 5pt;
    }
    
    h3 {
        color: #2c3e50;
        font-size: 14pt;
        font-weight: bold;
        margin-top: 20pt;
        margin-bottom: 10pt;
    }
    
    h4 {
        color: #2c3e50;
        font-size: 12pt;
        font-weight: bold;
        margin-top: 15pt;
        margin-bottom: 8pt;
    }
    
    p {
        margin-bottom: 12pt;
        text-align: justify;
    }
    
    ul, ol {
        margin-bottom: 12pt;
        padding-left: 20pt;
    }
    
    li {
        margin-bottom: 6pt;
    }
    
    table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 20pt;
        font-size: 10pt;
    }
    
    th, td {
        border: 1pt solid #bdc3c7;
        padding: 8pt;
        text-align: left;
    }
    
    th {
        background-color: #ecf0f1;
        font-weight: bold;
        color: #2c3e50;
    }
    
    blockquote {
        border-left: 4pt solid #3498db;
        padding-left: 15pt;
        margin-left: 0;
        font-style: italic;
        color: #555;
    }
    
    code {
        background-color: #f8f9fa;
        padding: 2pt 4pt;
        border-radius: 3pt;
        font-family: 'Courier New', monospace;
        font-size: 10pt;
    }
    
    .toc {
        background-color: #f8f9fa;
        border: 1pt solid #dee2e6;
        padding: 20pt;
        margin-bottom: 30pt;
        page-break-after: always;
    }
    
    .toc h2 {
        margin-top: 0;
        color: #2c3e50;
    }
    
    .contact-info {
        background-color: #fff3cd;
        border: 1pt solid #ffeaa7;
        padding: 15pt;
        margin: 20pt 0;
        border-radius: 5pt;
    }
    
    .warning {
        background-color: #f8d7da;
        border: 1pt solid #f5c6cb;
        padding: 15pt;
        margin: 20pt 0;
        border-radius: 5pt;
    }
    
    .info {
        background-color: #d1ecf1;
        border: 1pt solid #bee5eb;
        padding: 15pt;
        margin: 20pt 0;
        border-radius: 5pt;
    }
    
    strong {
        font-weight: bold;
        color: #2c3e50;
    }
    
    em {
        font-style: italic;
    }
    
    hr {
        border: none;
        border-top: 2pt solid #bdc3c7;
        margin: 30pt 0;
    }
    
    .page-break {
        page-break-before: always;
    }
    
    @media print {
        .no-print {
            display: none;
        }
    }
    """
    
    # Wrap HTML content with proper structure
    full_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VIVALY Care Platform - Complete Policies Documentation</title>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Create CSS object
    css = CSS(string=css_style)
    
    # Generate PDF
    html_doc = HTML(string=full_html)
    html_doc.write_pdf(output_pdf, stylesheets=[css])
    
    print(f"PDF successfully created: {output_pdf}")
    return output_pdf

if __name__ == "__main__":
    # Convert the comprehensive policies document
    markdown_file = "VIVALY-Complete-Policies-Document.md"
    output_pdf = "VIVALY-Complete-Policies-Document.pdf"
    
    if os.path.exists(markdown_file):
        convert_markdown_to_pdf(markdown_file, output_pdf)
        print(f"File size: {os.path.getsize(output_pdf) / 1024:.1f} KB")
    else:
        print(f"Error: {markdown_file} not found")