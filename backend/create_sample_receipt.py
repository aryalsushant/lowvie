from fpdf import FPDF
import os

def create_sample_receipt():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Header
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="Business Receipt", ln=1, align='C')
    pdf.ln(10)
    
    # Material vendor details
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Material Vendor:", ln=1, align='L')
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Premium Hoodies Co.", ln=1, align='L')
    pdf.cell(200, 10, txt="123 Market Street", ln=1, align='L')
    pdf.cell(200, 10, txt="San Francisco, CA 94105", ln=1, align='L')
    pdf.cell(200, 10, txt="Email: sales@premiumhoodies.com", ln=1, align='L')
    pdf.cell(200, 10, txt="Order: 100 Blank Hoodies @ $25.00 each", ln=1, align='L')
    pdf.cell(200, 10, txt="Total: $2,500.00", ln=1, align='L')
    pdf.ln(10)
    
    # Printing vendor details
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Printing Vendor:", ln=1, align='L')
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="FastPrint Solutions", ln=1, align='L')
    pdf.cell(200, 10, txt="456 Design Avenue", ln=1, align='L')
    pdf.cell(200, 10, txt="San Francisco, CA 94110", ln=1, align='L')
    pdf.cell(200, 10, txt="Email: orders@fastprint.com", ln=1, align='L')
    pdf.cell(200, 10, txt="Service: Full Color Screen Printing @ $8.50 per item", ln=1, align='L')
    pdf.cell(200, 10, txt="Total: $850.00", ln=1, align='L')
    pdf.ln(10)
    
    # Shipping vendor details
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Shipping Vendor:", ln=1, align='L')
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="QuickShip Logistics", ln=1, align='L')
    pdf.cell(200, 10, txt="789 Transport Road", ln=1, align='L')
    pdf.cell(200, 10, txt="San Francisco, CA 94107", ln=1, align='L')
    pdf.cell(200, 10, txt="Email: support@quickship.com", ln=1, align='L')
    pdf.cell(200, 10, txt="Service: City-wide Distribution @ $5.75 per item", ln=1, align='L')
    pdf.cell(200, 10, txt="Total: $575.00", ln=1, align='L')
    
    # Save the pdf
    pdf_path = os.path.join(os.path.dirname(__file__), 'receipts', 'sample_receipt.pdf')
    pdf.output(pdf_path)

if __name__ == "__main__":
    create_sample_receipt()