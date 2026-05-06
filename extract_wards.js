const fs = require('fs');
const content = fs.readFileSync('src/app/components/registration/registration.ts', 'utf8');
const match = content.match(/wards = signal<any>\(\[\s*([\s\S]*?)\s*\]\);/);
if (match) {
    fs.writeFileSync('src/app/shared/wards.ts', 'export const WARDS = [\n' + match[1] + '\n];\n');
    console.log('Success');
} else {
    console.log('Not found');
}
