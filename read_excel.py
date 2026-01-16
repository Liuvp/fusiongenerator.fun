import sys
try:
    import pandas as pd
except ImportError:
    print("pandas not installed, trying openpyxl")
    import openpyxl
    wb = openpyxl.load_workbook(sys.argv[1])
    ws = wb.active
    for row in ws.iter_rows(values_only=True):
        print('\t'.join(str(cell) if cell is not None else '' for cell in row))
    sys.exit(0)

# Try pandas
df = pd.read_excel(sys.argv[1])
print(df.to_string())
