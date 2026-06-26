const fs = require('fs');

function applyHomePageSpacing() {
  const file = 'src/Components/user/HomePage/HomePage.jsx';
  let c = fs.readFileSync(file, 'utf8');

  // 1. Hero banner padding Y from py-20 to py-28
  c = c.replace(/className="relative bg-gradient-to-r from-\[#EE0033\] to-\[#A00022\] text-white py-20 px-4 overflow-hidden"/g,
                'className="relative bg-gradient-to-r from-[#EE0033] to-[#A00022] text-white py-28 px-4 overflow-hidden"');

  // 2. Package section from py-16 to mt-12 py-20
  c = c.replace(/className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"/g,
                'className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-20"');

  // 3. Footer spacing from pt-12 to mt-24 pt-16
  c = c.replace(/className="bg-gray-900 text-gray-400 pt-12 pb-6 border-t border-gray-800"/g,
                'className="bg-gray-900 text-gray-400 mt-24 pt-16 pb-8 border-t border-gray-800"');

  // 4. Quick actions grid spacing gap-4 -> gap-6, p-6 -> p-8
  c = c.replace(/className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"/g,
                'className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"');

  fs.writeFileSync(file, c);
}

function applyPackagePageSpacing() {
  const file = 'src/Components/user/PackagePage/PackagePage.jsx';
  let c = fs.readFileSync(file, 'utf8');

  // Fix typo and increase top/bottom padding
  c = c.replace(/className="w-full bg-\[#f4f5f7\] min-screen px-4 py-12 text-neutral-800 font-sans antialiased select-none"/g,
                'className="w-full bg-[#f4f5f7] min-h-screen px-4 py-20 text-neutral-800 font-sans antialiased select-none"');

  // Increase vertical spacing between sections
  c = c.replace(/className="max-w-6xl mx-auto space-y-12"/g,
                'className="max-w-6xl mx-auto space-y-16"');

  fs.writeFileSync(file, c);
}

applyHomePageSpacing();
applyPackagePageSpacing();
