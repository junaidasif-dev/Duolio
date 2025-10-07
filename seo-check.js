#!/usr/bin/env node

/**
 * SEO Validation Script for duolio.me
 * Quick checks for common SEO issues
 */

const https = require('https');
const fs = require('fs');

const SITE_URL = 'https://duolio.me';
const checks = [];

console.log('🔍 Running SEO validation for duolio.me...\n');

// Check 1: Verify sitemap.xml is accessible
function checkSitemap() {
  return new Promise((resolve) => {
    https.get(`${SITE_URL}/sitemap.xml`, (res) => {
      if (res.statusCode === 200) {
        checks.push({ name: 'Sitemap', status: '✅', message: 'Accessible' });
      } else {
        checks.push({ name: 'Sitemap', status: '❌', message: `Status: ${res.statusCode}` });
      }
      resolve();
    }).on('error', () => {
      checks.push({ name: 'Sitemap', status: '❌', message: 'Not accessible' });
      resolve();
    });
  });
}

// Check 2: Verify robots.txt is accessible
function checkRobots() {
  return new Promise((resolve) => {
    https.get(`${SITE_URL}/robots.txt`, (res) => {
      if (res.statusCode === 200) {
        checks.push({ name: 'Robots.txt', status: '✅', message: 'Accessible' });
      } else {
        checks.push({ name: 'Robots.txt', status: '❌', message: `Status: ${res.statusCode}` });
      }
      resolve();
    }).on('error', () => {
      checks.push({ name: 'Robots.txt', status: '❌', message: 'Not accessible' });
      resolve();
    });
  });
}

// Check 3: Verify manifest.json is accessible
function checkManifest() {
  return new Promise((resolve) => {
    https.get(`${SITE_URL}/manifest.json`, (res) => {
      if (res.statusCode === 200) {
        checks.push({ name: 'Manifest', status: '✅', message: 'Accessible' });
      } else {
        checks.push({ name: 'Manifest', status: '❌', message: `Status: ${res.statusCode}` });
      }
      resolve();
    }).on('error', () => {
      checks.push({ name: 'Manifest', status: '❌', message: 'Not accessible' });
      resolve();
    });
  });
}

// Check 4: Verify HTTPS is working
function checkHTTPS() {
  return new Promise((resolve) => {
    https.get(SITE_URL, (res) => {
      if (res.statusCode === 200) {
        checks.push({ name: 'HTTPS', status: '✅', message: 'Working' });
      } else {
        checks.push({ name: 'HTTPS', status: '⚠️', message: `Status: ${res.statusCode}` });
      }
      resolve();
    }).on('error', (e) => {
      checks.push({ name: 'HTTPS', status: '❌', message: e.message });
      resolve();
    });
  });
}

// Check 5: Verify homepage loads
function checkHomepage() {
  return new Promise((resolve) => {
    https.get(SITE_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const hasTitle = data.includes('<title>DuoLio');
        const hasDescription = data.includes('meta name="description"');
        const hasCanonical = data.includes('rel="canonical"');
        const hasOG = data.includes('property="og:');
        const hasSchema = data.includes('application/ld+json');
        
        if (hasTitle && hasDescription && hasCanonical && hasOG && hasSchema) {
          checks.push({ name: 'Homepage Meta', status: '✅', message: 'All tags present' });
        } else {
          const missing = [];
          if (!hasTitle) missing.push('title');
          if (!hasDescription) missing.push('description');
          if (!hasCanonical) missing.push('canonical');
          if (!hasOG) missing.push('OG tags');
          if (!hasSchema) missing.push('schema');
          checks.push({ name: 'Homepage Meta', status: '⚠️', message: `Missing: ${missing.join(', ')}` });
        }
        resolve();
      });
    }).on('error', () => {
      checks.push({ name: 'Homepage Meta', status: '❌', message: 'Cannot load page' });
      resolve();
    });
  });
}

// Local file checks (if running from project directory)
function checkLocalFiles() {
  const files = [
    'index.html',
    'sitemap.xml',
    'robots.txt',
    'manifest.json',
    'SEO-CHECKLIST.md',
    'DEPLOYMENT-SEO-GUIDE.md'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      checks.push({ name: `Local: ${file}`, status: '✅', message: 'Exists' });
    } else {
      checks.push({ name: `Local: ${file}`, status: '❌', message: 'Missing' });
    }
  });
}

// Run all checks
async function runChecks() {
  await checkHTTPS();
  await checkSitemap();
  await checkRobots();
  await checkManifest();
  await checkHomepage();
  
  // Run local checks if in project directory
  try {
    checkLocalFiles();
  } catch (e) {
    console.log('Note: Not running from project directory, skipping local file checks.\n');
  }
  
  // Print results
  console.log('═══════════════════════════════════════════════════════');
  console.log('                    SEO CHECK RESULTS                  ');
  console.log('═══════════════════════════════════════════════════════\n');
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name.padEnd(20)} - ${check.message}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════');
  
  const passed = checks.filter(c => c.status === '✅').length;
  const warnings = checks.filter(c => c.status === '⚠️').length;
  const failed = checks.filter(c => c.status === '❌').length;
  
  console.log(`\nPassed: ${passed} | Warnings: ${warnings} | Failed: ${failed}`);
  console.log('\n📝 Next Steps:');
  console.log('1. Submit sitemap to Google Search Console');
  console.log('2. Verify structured data: https://search.google.com/test/rich-results');
  console.log('3. Test social cards: Facebook Debugger & Twitter Card Validator');
  console.log('4. Run Lighthouse audit: https://pagespeed.web.dev/');
  console.log('5. Check mobile-friendliness: https://search.google.com/test/mobile-friendly');
  console.log('\n');
}

runChecks();
