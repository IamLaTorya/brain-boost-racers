import k2Data from '../data/k2.json';
import grades35Data from '../data/grades35.json';
import grades68Data from '../data/grades68.json';

// Session memory to ensure players get fresh questions across multiple races without repeats
const seenQuestionIds = new Set();

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Dynamic generator to expand each grade level dataset to over 275 unique questions
function generateExtraQuestionsForGrade(grade) {
  const generated = [];

  if (grade === 'K-2') {
    // 1. Addition facts (1-20)
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        const sum = a + b;
        const wrong1 = sum + 1;
        const wrong2 = Math.max(0, sum - 1);
        const wrong3 = sum + 2;
        const opts = shuffleArray([
          sum.toString(),
          wrong1.toString(),
          wrong2.toString(),
          wrong3.toString(),
        ]);
        generated.push({
          id: `gen_k2_add_${a}_${b}`,
          question: `What is ${a} + ${b}?`,
          answers: opts,
          correctIndex: opts.indexOf(sum.toString()),
          difficulty: sum > 10 ? 'medium' : 'easy',
          topic: 'Addition',
          explanation: `${a} plus ${b} equals ${sum}!`,
        });
      }
    }

    // 2. Subtraction facts (1-20)
    for (let top = 4; top <= 18; top++) {
      for (let sub = 1; sub < top; sub++) {
        if (generated.length >= 120) break;
        const diff = top - sub;
        const opts = shuffleArray([
          diff.toString(),
          (diff + 1).toString(),
          Math.max(0, diff - 1).toString(),
          (diff + 2).toString(),
        ]);
        generated.push({
          id: `gen_k2_sub_${top}_${sub}`,
          question: `What is ${top} - ${sub}?`,
          answers: opts,
          correctIndex: opts.indexOf(diff.toString()),
          difficulty: top > 10 ? 'medium' : 'easy',
          topic: 'Subtraction',
          explanation: `${top} minus ${sub} equals ${diff}!`,
        });
      }
    }

    // 3. Counting & Next Numbers
    for (let num = 11; num <= 50; num += 2) {
      const next = num + 1;
      const opts = shuffleArray([
        next.toString(),
        (next + 1).toString(),
        (next - 2).toString(),
        (next + 2).toString(),
      ]);
      generated.push({
        id: `gen_k2_count_${num}`,
        question: `Which number comes right after ${num}?`,
        answers: opts,
        correctIndex: opts.indexOf(next.toString()),
        difficulty: 'easy',
        topic: 'Counting',
        explanation: `Counting up: ... ${num}, ${next}!`,
      });
    }

    // 4. Extensive Grade K-2 Financial Literacy & Money Questions (30+ dynamic questions)
    // Coin value questions
    const coins = [
      { name: 'penny', val: 1 },
      { name: 'nickel', val: 5 },
      { name: 'dime', val: 10 },
      { name: 'quarter', val: 25 },
    ];

    coins.forEach((c) => {
      const opts = shuffleArray([
        `${c.val} cent${c.val > 1 ? 's' : ''}`,
        `${c.val + 4} cents`,
        `${Math.max(1, c.val - 2)} cents`,
        `${c.val + 10} cents`,
      ]);
      generated.push({
        id: `gen_k2_fin_coin_${c.name}`,
        question: `How many cents is a ${c.name} worth?`,
        answers: opts,
        correctIndex: opts.indexOf(`${c.val} cent${c.val > 1 ? 's' : ''}`),
        difficulty: 'easy',
        topic: 'Financial Literacy',
        explanation: `A ${c.name} is worth ${c.val} cent${c.val > 1 ? 's' : ''}!`,
      });
    });

    // Dimes & Nickels counting generator
    for (let d = 1; d <= 5; d++) {
      for (let n = 1; n <= 3; n++) {
        const totalCents = d * 10 + n * 5;
        const opts = shuffleArray([
          `${totalCents} cents`,
          `${totalCents + 5} cents`,
          `${totalCents - 5} cents`,
          `${totalCents + 10} cents`,
        ]);
        generated.push({
          id: `gen_k2_fin_count_${d}_${n}`,
          question: `If you have ${d} dime${d > 1 ? 's' : ''} and ${n} nickel${n > 1 ? 's' : ''}, how many cents do you have?`,
          answers: opts,
          correctIndex: opts.indexOf(`${totalCents} cents`),
          difficulty: 'medium',
          topic: 'Financial Literacy',
          explanation: `${d} dime(s) = ${d * 10}¢ plus ${n} nickel(s) = ${n * 5}¢ for a total of ${totalCents} cents!`,
        });
      }
    }

    // Piggy Bank Savings Addition
    for (let s1 = 3; s1 <= 15; s1 += 3) {
      for (let s2 = 2; s2 <= 10; s2 += 2) {
        const total = s1 + s2;
        const opts = shuffleArray([
          `${total} coins`,
          `${total + 2} coins`,
          `${Math.max(1, total - 2)} coins`,
          `${total + 5} coins`,
        ]);
        generated.push({
          id: `gen_k2_fin_piggy_${s1}_${s2}`,
          question: `You saved ${s1} coins in your bank yesterday and ${s2} coins today. How many coins total?`,
          answers: opts,
          correctIndex: opts.indexOf(`${total} coins`),
          difficulty: 'easy',
          topic: 'Financial Literacy',
          explanation: `${s1} + ${s2} = ${total} coins in your savings bank!`,
        });
      }
    }

    // Spending vs Saving choice
    const k2Concepts = [
      { q: "Which of these is a NEED for living?", a: "Healthy Food", opts: ["Healthy Food", "Video Games", "Race Car Toy", "Candy Bar"], exp: "Food, water, and shelter are essential NEEDS!" },
      { q: "Which of these is a WANT?", a: "New Toy Car", opts: ["New Toy Car", "Drinking Water", "Warm Clothes", "A Safe Home"], exp: "A toy is a WANT, while water and clothes are NEEDS!" },
      { q: "Why do we keep money in a Savings Bank?", a: "To keep it safe and earn extra bonus coins", opts: ["To keep it safe and earn extra bonus coins", "To lose it", "To throw it away", "To make it dirty"], exp: "Savings banks guard your coins and pay you interest bonus coins!" },
      { q: "You have 10 coins and buy a sticker for 3 coins. How many coins do you have left?", a: "7 coins", opts: ["7 coins", "5 coins", "8 coins", "3 coins"], exp: "10 - 3 = 7 coins remaining in your wallet!" },
      { q: "If your bank gives you 1 bonus coin for every 5 coins you save, how many bonus coins do you get for saving 10 coins?", a: "2 bonus coins", opts: ["2 bonus coins", "1 bonus coin", "5 bonus coins", "3 bonus coins"], exp: "10 ÷ 5 = 2 bonus interest coins!" },
    ];
    k2Concepts.forEach((cq, idx) => {
      const shuffledOpts = shuffleArray(cq.opts);
      generated.push({
        id: `gen_k2_fin_concept_${idx}`,
        question: cq.q,
        answers: shuffledOpts,
        correctIndex: shuffledOpts.indexOf(cq.a),
        difficulty: 'easy',
        topic: 'Financial Literacy',
        explanation: cq.exp,
      });
    });

  } else if (grade === '3-5') {
    // 1. Multiplication facts (2x2 up to 12x12)
    for (let a = 2; a <= 12; a++) {
      for (let b = 2; b <= 12; b++) {
        const prod = a * b;
        const opts = shuffleArray([
          prod.toString(),
          (prod + a).toString(),
          Math.max(1, prod - b).toString(),
          (prod + 4).toString(),
        ]);
        generated.push({
          id: `gen_g35_mult_${a}_${b}`,
          question: `What is ${a} × ${b}?`,
          answers: opts,
          correctIndex: opts.indexOf(prod.toString()),
          difficulty: prod > 50 ? 'hard' : 'medium',
          topic: 'Multiplication',
          explanation: `${a} times ${b} equals ${prod}!`,
        });
      }
    }

    // 2. Division facts
    for (let b = 2; b <= 10; b++) {
      for (let ans = 2; ans <= 12; ans++) {
        const top = b * ans;
        const opts = shuffleArray([
          ans.toString(),
          (ans + 1).toString(),
          Math.max(1, ans - 1).toString(),
          (ans + 2).toString(),
        ]);
        generated.push({
          id: `gen_g35_div_${top}_${b}`,
          question: `What is ${top} ÷ ${b}?`,
          answers: opts,
          correctIndex: opts.indexOf(ans.toString()),
          difficulty: 'medium',
          topic: 'Division',
          explanation: `${top} divided by ${b} equals ${ans}!`,
        });
      }
    }

    // 3. Extensive Grade 3-5 Financial Literacy & Interest Rate Questions (35+ dynamic questions)
    // 8% Grade 3-5 Interest calculations
    const deposits35 = [50, 100, 150, 200, 250, 300, 400, 500];
    deposits35.forEach((dep) => {
      const interest = (dep * 0.08).toFixed(0);
      const opts = shuffleArray([
        `$${interest}`,
        `$${Number(interest) + 4}`,
        `$${Math.max(1, Number(interest) - 2)}`,
        `$${Number(interest) + 10}`,
      ]);
      generated.push({
        id: `gen_g35_fin_interest_${dep}`,
        question: `Grade 3-5 Bank pays 8% interest per year. If you deposit $${dep} in Savings, how much bonus interest do you earn in 1 year?`,
        answers: opts,
        correctIndex: opts.indexOf(`$${interest}`),
        difficulty: 'medium',
        topic: 'Financial Literacy',
        explanation: `8% of $${dep} = $${dep} × 0.08 = $${interest} bonus coins!`,
      });
    });

    // Savings goal weeks math
    const goals35 = [
      { item: 'Turbo Engine', price: 120, weeklySave: 20 },
      { item: 'Neon Wheels', price: 150, weeklySave: 30 },
      { item: 'Gold Helmet', price: 200, weeklySave: 25 },
      { item: 'Dragon Decal', price: 90, weeklySave: 15 },
      { item: 'Spoiler Wing', price: 180, weeklySave: 30 },
    ];
    goals35.forEach((g) => {
      const weeks = g.price / g.weeklySave;
      const opts = shuffleArray([
        `${weeks} weeks`,
        `${weeks + 2} weeks`,
        `${Math.max(1, weeks - 1)} weeks`,
        `${weeks + 4} weeks`,
      ]);
      generated.push({
        id: `gen_g35_fin_goal_${g.item.replace(/\s+/g, '')}`,
        question: `A ${g.item} costs $${g.price}. If you save $${g.weeklySave} each week, how many weeks until you can afford it?`,
        answers: opts,
        correctIndex: opts.indexOf(`${weeks} weeks`),
        difficulty: 'medium',
        topic: 'Financial Literacy',
        explanation: `$${g.price} ÷ $${g.weeklySave} = ${weeks} weeks of saving!`,
      });
    });

    // Profit & Budgeting Math
    for (let buy = 20; buy <= 80; buy += 20) {
      for (let sell = buy + 15; sell <= buy + 45; sell += 15) {
        const profit = sell - buy;
        const opts = shuffleArray([
          `$${profit} profit`,
          `$${profit + 10} profit`,
          `$${Math.max(5, profit - 5)} profit`,
          `$${sell} profit`,
        ]);
        generated.push({
          id: `gen_g35_fin_profit_${buy}_${sell}`,
          question: `You bought a used race spoiler for $${buy} and sold it to another racer for $${sell}. What is your profit?`,
          answers: opts,
          correctIndex: opts.indexOf(`$${profit} profit`),
          difficulty: 'medium',
          topic: 'Financial Literacy',
          explanation: `Selling Price ($${sell}) - Buying Price ($${buy}) = $${profit} Profit!`,
        });
      }
    }

    const fin35Concepts = [
      { q: "What is a Budget?", a: "A financial plan for spending, saving, and sharing money", opts: ["A financial plan for spending, saving, and sharing money", "A ticket to enter a race", "A discount coupon at the shop", "A penalty fee from the bank"], exp: "A budget helps you plan your income, spending, and savings!" },
      { q: "What is interest earned on a Savings Account?", a: "Extra bonus money the bank pays you for storing your money with them", opts: ["Extra bonus money the bank pays you for storing your money with them", "A fine you pay to the bank", "Tax paid to the government", "Money stolen from your wallet"], exp: "Interest is the bank's reward to you for keeping your savings with them!" },
      { q: "What is the difference between a Debit Card and a Credit Card?", a: "Debit takes money immediately from your bank; Credit is a loan you pay back later", opts: ["Debit takes money immediately from your bank; Credit is a loan you pay back later", "They are identical", "Debit is fake money; Credit is real money", "Debit cards only work at toy stores"], exp: "Debit uses your existing bank money; Credit borrows money that must be repaid!" },
      { q: "If a race helmet costs $100 and has a 20% discount today, what is the sale price?", a: "$80", opts: ["$80", "$20", "$90", "$70"], exp: "Discount = 20% of $100 = $20. Sale price = $100 - $20 = $80!" },
    ];
    fin35Concepts.forEach((fq, idx) => {
      const shuffledOpts = shuffleArray(fq.opts);
      generated.push({
        id: `gen_g35_fin_concept_${idx}`,
        question: fq.q,
        answers: shuffledOpts,
        correctIndex: shuffledOpts.indexOf(fq.a),
        difficulty: 'medium',
        topic: 'Financial Literacy',
        explanation: fq.exp,
      });
    });

  } else if (grade === '6-8') {
    // 1. One-step & Two-step Algebra equations
    for (let a = 2; a <= 9; a++) {
      for (let x = 2; x <= 12; x++) {
        const c = a * x;
        const opts = shuffleArray([
          x.toString(),
          (x + 1).toString(),
          Math.max(1, x - 1).toString(),
          (x + 2).toString(),
        ]);
        generated.push({
          id: `gen_g68_alg1_${a}_${x}`,
          question: `Solve for x: ${a}x = ${c}`,
          answers: opts,
          correctIndex: opts.indexOf(x.toString()),
          difficulty: 'medium',
          topic: 'One-step Algebra',
          explanation: `Divide both sides by ${a}: x = ${c} ÷ ${a} = ${x}!`,
        });
      }
    }

    for (let a = 2; a <= 6; a++) {
      for (let x = 2; x <= 10; x++) {
        const b = 5;
        const rhs = a * x + b;
        const opts = shuffleArray([
          x.toString(),
          (x + 2).toString(),
          Math.max(1, x - 1).toString(),
          (x + 3).toString(),
        ]);
        generated.push({
          id: `gen_g68_alg2_${a}_${x}`,
          question: `Solve for x: ${a}x + ${b} = ${rhs}`,
          answers: opts,
          correctIndex: opts.indexOf(x.toString()),
          difficulty: 'hard',
          topic: 'Algebra',
          explanation: `Subtract ${b}: ${a}x = ${rhs - b}, then divide by ${a}: x = ${x}!`,
        });
      }
    }

    // 2. Percentages & Math
    for (let pct of [10, 15, 20, 25, 50]) {
      for (let base of [80, 120, 160, 200, 300, 400]) {
        const val = (pct / 100) * base;
        const opts = shuffleArray([
          val.toString(),
          (val + 5).toString(),
          Math.max(1, val - 5).toString(),
          (val * 2).toString(),
        ]);
        generated.push({
          id: `gen_g68_pct_${pct}_${base}`,
          question: `What is ${pct}% of ${base}?`,
          answers: opts,
          correctIndex: opts.indexOf(val.toString()),
          difficulty: 'medium',
          topic: 'Percentages',
          explanation: `${pct}% of ${base} = (${pct}/100) × ${base} = ${val}!`,
        });
      }
    }

    // 3. Extensive Grade 6-8 Compound Interest & Financial Literacy (40+ dynamic questions)
    // 10% Grade 6-8 Compound Interest Calculations
    const principal68 = [100, 200, 300, 400, 500, 600, 1000];
    principal68.forEach((p) => {
      const year1Interest = p * 0.10;
      const year1Balance = p + year1Interest;
      const year2Interest = year1Balance * 0.10;
      const year2Balance = year1Balance + year2Interest;

      // Year 1 Question
      const optsY1 = shuffleArray([
        `$${year1Balance}`,
        `$${year1Balance + 20}`,
        `$${year1Balance - 10}`,
        `$${p + 50}`,
      ]);
      generated.push({
        id: `gen_g68_fin_compY1_${p}`,
        question: `You deposit $${p} in a Grade 6-8 Savings Vault earning 10% annual compound interest. What is your total balance after 1 year?`,
        answers: optsY1,
        correctIndex: optsY1.indexOf(`$${year1Balance}`),
        difficulty: 'medium',
        topic: 'Financial Literacy',
        explanation: `$${p} + ($${p} × 0.10) = $${p} + $${year1Interest} = $${year1Balance}!`,
      });

      // Year 2 Compound Question
      const optsY2 = shuffleArray([
        `$${year2Balance}`,
        `$${p + 20}`,
        `$${year1Balance + 10}`,
        `$${year2Balance + 25}`,
      ]);
      generated.push({
        id: `gen_g68_fin_compY2_${p}`,
        question: `In Year 2, your $${year1Balance} balance earns 10% compound interest ($${year2Interest}). What is your new total balance after Year 2?`,
        answers: optsY2,
        correctIndex: optsY2.indexOf(`$${year2Balance}`),
        difficulty: 'hard',
        topic: 'Financial Literacy',
        explanation: `Year 2 Balance = $${year1Balance} + 10% ($${year2Interest}) = $${year2Balance}!`,
      });
    });

    // Rule of 72 questions (72 / R)
    const rates = [6, 8, 9, 12];
    rates.forEach((r) => {
      const years = 72 / r;
      const opts = shuffleArray([
        `${years} years`,
        `${years + 2} years`,
        `${Math.max(1, years - 2)} years`,
        `${years + 4} years`,
      ]);
      generated.push({
        id: `gen_g68_fin_r72_${r}`,
        question: `Using the Rule of 72, approximately how many years will it take for an investment to double at a ${r}% interest rate?`,
        answers: opts,
        correctIndex: opts.indexOf(`${years} years`),
        difficulty: 'hard',
        topic: 'Financial Literacy',
        explanation: `Rule of 72: 72 ÷ ${r}% = ${years} years to double your money!`,
      });
    });

    // Net Worth Calculations (Assets - Liabilities)
    const netWorthScenarios = [
      { assets: 500, liabilities: 100 },
      { assets: 800, liabilities: 250 },
      { assets: 1200, liabilities: 400 },
      { assets: 2000, liabilities: 600 },
    ];
    netWorthScenarios.forEach((nw) => {
      const net = nw.assets - nw.liabilities;
      const opts = shuffleArray([
        `$${net}`,
        `$${net + 100}`,
        `$${nw.assets + nw.liabilities}`,
        `$${net - 50}`,
      ]);
      generated.push({
        id: `gen_g68_fin_nw_${nw.assets}_${nw.liabilities}`,
        question: `If a racer has $${nw.assets} in Assets (cash + car value) and owes $${nw.liabilities} in Liabilities (parts loan), what is their Net Worth?`,
        answers: opts,
        correctIndex: opts.indexOf(`$${net}`),
        difficulty: 'hard',
        topic: 'Financial Literacy',
        explanation: `Net Worth = Assets ($${nw.assets}) - Liabilities ($${nw.liabilities}) = $${net}!`,
      });
    });

    const fin68Concepts = [
      { q: "What is Compound Interest?", a: "Earning interest on your principal PLUS all previously accumulated interest", opts: ["Earning interest on your principal PLUS all previously accumulated interest", "A fee charged when you open a checking account", "A fixed penalty for late bill payment", "An interest rate that drops every month"], exp: "Compound interest generates exponential growth by paying interest on prior interest!" },
      { q: "What does Inflation do to purchasing power over time?", a: "It decreases purchasing power because prices rise", opts: ["It decreases purchasing power because prices rise", "It increases purchasing power because cars get cheaper", "It doubles your bank savings balance", "It eliminates all taxes"], exp: "Inflation causes goods to cost more, reducing what 1 dollar can buy!" },
      { q: "Why is diversification important when investing?", a: "It spreads risk across different assets so one bad loss won't ruin you", opts: ["It spreads risk across different assets so one bad loss won't ruin you", "It guarantees you will double your money in 1 day", "It stops the bank from charging fees", "It lets you buy race cars for free"], exp: "Don't put all your eggs in one basket — diversification reduces investment risk!" },
    ];
    fin68Concepts.forEach((fq, idx) => {
      const shuffledOpts = shuffleArray(fq.opts);
      generated.push({
        id: `gen_g68_fin_concept_${idx}`,
        question: fq.q,
        answers: shuffledOpts,
        correctIndex: shuffledOpts.indexOf(fq.a),
        difficulty: 'hard',
        topic: 'Financial Literacy',
        explanation: fq.exp,
      });
    });
  }

  return generated;
}

// Master question retriever ensuring 275+ unique questions per grade
export function getQuestionsForGrade(grade) {
  let jsonBase = [];
  switch (grade) {
    case 'K-2':
      jsonBase = k2Data;
      break;
    case '3-5':
      jsonBase = grades35Data;
      break;
    case '6-8':
      jsonBase = grades68Data;
      break;
    default:
      jsonBase = k2Data;
  }

  const extraGenerated = generateExtraQuestionsForGrade(grade);
  const combined = [...jsonBase, ...extraGenerated];

  // Guarantee uniqueness by question ID
  const map = new Map();
  combined.forEach((q) => {
    if (!map.has(q.id)) {
      map.set(q.id, q);
    }
  });

  return Array.from(map.values());
}

export function getRaceQuestions(grade, count = 5) {
  const allQuestions = getQuestionsForGrade(grade);

  // Filter out questions seen in recent races
  let unseenPool = allQuestions.filter((q) => !seenQuestionIds.has(q.id));

  // If we've cycled through all 275+ questions, reset seen history
  if (unseenPool.length < count) {
    seenQuestionIds.clear();
    unseenPool = [...allQuestions];
  }

  // Ensure every race contains at least 1 grade-appropriate Financial Literacy / Banking question!
  const finQuestions = unseenPool.filter((q) => q.topic === 'Financial Literacy');
  const mathQuestions = unseenPool.filter((q) => q.topic !== 'Financial Literacy');

  let selected = [];
  if (finQuestions.length > 0 && count > 1) {
    const finShuffled = shuffleArray(finQuestions);
    const selectedFin = finShuffled.slice(0, 1);
    const mathShuffled = shuffleArray(mathQuestions);
    const selectedMath = mathShuffled.slice(0, count - 1);
    selected = shuffleArray([...selectedFin, ...selectedMath]);
  } else {
    const shuffled = shuffleArray(unseenPool);
    selected = shuffled.slice(0, count);
  }

  // Record selected IDs into seen set
  selected.forEach((q) => seenQuestionIds.add(q.id));

  return selected;
}

export function getHarderTurboQuestions(grade) {
  const questions = getQuestionsForGrade(grade);
  const harder = questions.filter(
    (q) =>
      q.difficulty === 'hard' ||
      q.topic === 'Word Problems' ||
      q.topic === 'Financial Literacy' ||
      q.topic === 'One-step Algebra' ||
      q.topic === 'Order of Operations' ||
      q.topic === 'Algebra'
  );

  const pool = harder.length >= 5 ? harder : questions;
  return shuffleArray(pool);
}
