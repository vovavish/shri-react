import { execSync } from 'child_process';

const MAX_RUNS = 3;
let passed = 0;

for (let i = 1; i <= MAX_RUNS; i++) {
  try {
    console.log(`\n🔁 Test run -- --all #${i}`);
    execSync('vitest run', { stdio: 'inherit' });
    passed++;
  } catch (err) {
    console.error(`❌ Запуск #${i} с ошибкой.`);
  }
}

if (passed === MAX_RUNS) {
  console.log('\nВсе тесты прошли успешно.');
  process.exit(0);
} else {
  console.error(`\n🚨 Только ${passed}/${MAX_RUNS} тестов прошло успешно.`);
  process.exit(1);
}
