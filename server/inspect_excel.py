import pandas as pd
import sys

print('Starting...')
try:
    df = pd.read_excel('data/data-cskh.xlsx')
    print('=== COT DATA ===')
    print(list(df.columns))
    print()
    print('=== SO DONG:', len(df))
    print()
    print('=== 10 DONG DAU TIEN ===')
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 300)
    pd.set_option('display.max_colwidth', 50)
    print(df.head(10).to_string())
    print()
    print('=== KIEU DU LIEU ===')
    print(df.dtypes)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    import traceback
    traceback.print_exc()
