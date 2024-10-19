Aplikasi sederhana untuk use case fuzzy logic. Memprediksi tingkat kemungkinan terkena stroke berdasarkan beberapa variable linguistik seperti umur, BMI, dan frekuensi olahraga. Defuzzyfication menggunakan metode Tsukamoto.

## How to Run

Setelah repo ini di clone install semua dependency dengan `npm install` (atau `pnpm install` atau `bun install`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

# What's this app is about?

This app is basically a visualizer of fuzzy inference. The app will try to predict chances of people getting stroke disease using fuzzy inference. The steps is like this:
1. We'll display a form asking user about their age, their body height, their body weight, and the frequency of sport they do per week.
2. We'll setup a function for calculating the value of a variable within a fuzzy set. Basically the set will be needing a formula to calculate a value based on the curve representation of a set. The method will be calculateDownward(bot_limit, top_limit, target_value) and calculateUpward(bot_limit, top_limit, target_value). Downward curve will be having a formula of (top_limit - target_value) / (top_limit - bot_limit) meanwhile an Upward curve will be having a formula of (target_value - bot_limit) / (top_limit - bot_limit)
3. We need to display the variables we're going to use and also the Fuzzy Sets, Here's the detail:
a. Age 
- Muda, age below 25 will be having a value of 1, age between 25 and 40 will use the calculateDownward(25, 40, age).
- Dewasa, age between 25 and 40 will use the calculateUpward(25, 40, age) and age between 40 and 55 will use calculateDownward(40, 55, age)
- Tua, age between 40 and 55 will use calculateUpward(40, 55, age)and age above 55 will be having a value of 1.
b. BMI (Body Mass Index)
- Normal, weight below 25 will have a value of 1, and body weight between 25 and 28 will use calculateDownward(25, 28, weight)
- Gemuk, weight between 25 and 30 will use calculateUpward(25, 30, weight) and weight above 30 will be having a value of 1
c. Sport
- Sering, frequency of 0 to 4 will be using calculateUpward(0, 4, frequency) and frequency above 4 will be having a value of 1
Because this app was a visualizer app to help student learn about fuzzy we also need to Olahraga the visualization of all the Fuzzy Set above (Age, BMI, Sport) whether it's in a chart or other format.
d. Stroke Chance
- Rendah, chance of 0 to 100 will use calculateDownward(0, 100, chance)
- Tinggi, chance of 0 to 100 will use calculateUpward(0, 100, chance)
4. Now we need to set the Fuzzy Rules
a. R1 - IF Age is `Tua` AND BMI is `Gemuk` AND Sport frequency is `1 - Tidak Sering` THEN Chance of Stroke is `Tinggi`
b. R2 - IF BMI is `Normal` AND Sport frequency is `Sering` THEN Chance of Stroke is `Rendah`
We need to also display this rule in some format for the student
5. Count the `alpha` predicate
- Get the value of Tua(age)
- Get the value of Normal(weight)
- Get the value of Gemuk(weight)
- Get the value of Sering(frequency)
Then for R1, alpha1 = min(use alpha of dewasa if > 0.2 or alpha of Tua, alpha of Gemuk, (1 - alpha of Sering))
for R2, alpha2 = min(alpha of Normal, alpha of Sering)
6. Now we can do the defuzzy step by using `Tsukamoto Method`. For R1 we'll use method of Stroke chance `Tinggi` which is calculateUpward(0, 100, alpha1) and for R2 we'll use the method of Stroke chance `Rendah` which is calculateDownward(0, 100, alpha2). We will then display this result.