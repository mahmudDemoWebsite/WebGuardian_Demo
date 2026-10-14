WebGuardian Demo — তিন ফাইলের ওয়েবসাইট স্বাস্থ্য পরীক্ষা UI

ফাইল:
- index.html
- style.css
- script.js

চালানোর নিয়ম:
1. তিনটি ফাইল একই ফোল্ডারে রাখুন।
2. index.html-এ ডাবল-ক্লিক করে Chrome বা অন্য আধুনিক ব্রাউজারে খুলুন।
3. URL লিখে “ডেমো স্ক্যান চালান” চাপলে নমুনা রিপোর্ট তৈরি হবে। এটি লাইভ URL স্ক্যান করে না।
4. “নিজের HTML পরীক্ষা করুন” থেকে নিজের HTML কোড পেস্ট করুন অথবা “নমুনা কোড লোড করুন” চাপুন, তারপর “HTML পরীক্ষা করুন” চাপুন। HTML কোডের কয়েকটি নিয়মভিত্তিক চেক ব্রাউজারেই চলে।
5. JSON রিপোর্ট ডাউনলোড, সারাংশ কপি, প্রিন্ট/PDF এবং স্থানীয় স্ক্যান ইতিহাস ব্যবহার করতে পারবেন।

গুরুত্বপূর্ণ সীমাবদ্ধতা:
- URL-ভিত্তিক স্ক্যানটি UI প্রদর্শনের জন্য তৈরি নমুনা; কোনো live site-এ অনুরোধ পাঠায় না।
- HTML পরীক্ষায় প্রকৃত page speed, HTTP response, সার্ভার, নিরাপত্তা দুর্বলতা, JavaScript কার্যকারিতা, responsive rendering বা বাস্তব broken links যাচাই করা হয় না।
- Google Fonts থাকলে অনলাইনে ফন্ট লোড হতে পারে; নেট না থাকলেও system fallback দিয়ে সাইট চলবে।
- এই ডেমোতে ChatGPT/OpenAI API Key লাগে না।
- production-এর জন্য server/API scan engine, request validation, rate limiting এবং নিরাপদ API key storage যোগ করতে হবে।

Live Link:  https://mahmuddemowebsite.github.io/WebGuardian_Demo/
