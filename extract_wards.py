import re

with open(r'c:\Users\Emperor\Desktop\New stuff\Chagua\Uchaguzi-Frontend\src\app\components\registration\registration.ts', 'r', encoding='utf-8') as f:
    txt = f.read()

match = re.search(r'wards = signal<any>\(\[\s*(.*?)\s*\]\);', txt, re.DOTALL)
if match:
    with open(r'c:\Users\Emperor\Desktop\New stuff\Chagua\Uchaguzi-Frontend\src\app\shared\wards.ts', 'w', encoding='utf-8') as out:
        out.write('export const WARDS = [\n' + match.group(1) + '\n];\n')
    print('Successfully created wards.ts')
else:
    print('Could not find wards in registration.ts')
