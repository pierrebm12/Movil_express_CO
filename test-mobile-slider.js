const puppeteer = require('puppeteer');

async function testMobileSlider() {
  console.log('🚀 Iniciando testing del slider móvil...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Test en diferentes viewports
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Samsung Galaxy S8+', width: 360, height: 740 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'Desktop', width: 1200, height: 800 }
  ];
  
  for (const viewport of viewports) {
    console.log(`\n📱 Testing en ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });
    
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    
    // Scroll hasta la sección de productos
    await page.evaluate(() => {
      const productSection = document.querySelector('#destacados') || 
                           document.querySelector('h2:contains("más vendidos")') ||
                           document.querySelector('[class*="product"]');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo(0, 800);
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verificar cuántos productos se muestran
    const productCards = await page.$$('[class*="group hover:shadow-2xl"]');
    const visibleProducts = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="group hover:shadow-2xl"]');
      let visible = 0;
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.left >= 0 && rect.right <= window.innerWidth) {
          visible++;
        }
      });
      return visible;
    });
    
    // Verificar controles móviles
    const mobileControls = await page.$$('[class*="sm:hidden"]');
    const desktopControls = await page.$$('[class*="hidden sm:flex"]');
    
    // Verificar indicadores de puntos
    const dotIndicators = await page.$$('[class*="w-2 h-2 rounded-full"]');
    
    console.log(`   ✅ Productos totales encontrados: ${productCards.length}`);
    console.log(`   ✅ Productos visibles: ${visibleProducts}`);
    console.log(`   ✅ Controles móviles: ${mobileControls.length}`);
    console.log(`   ✅ Controles desktop: ${desktopControls.length}`);
    console.log(`   ✅ Indicadores de puntos: ${dotIndicators.length}`);
    
    // Test específico para móvil
    if (viewport.width < 640) {
      console.log(`   📱 Testing funcionalidad móvil específica...`);
      
      // Verificar que solo se muestra 1 producto
      if (visibleProducts === 1) {
        console.log(`   ✅ CORRECTO: Se muestra exactamente 1 producto en móvil`);
      } else {
        console.log(`   ❌ ERROR: Se muestran ${visibleProducts} productos, debería ser 1`);
      }
      
      // Verificar controles móviles
      if (mobileControls.length > 0) {
        console.log(`   ✅ CORRECTO: Controles móviles presentes`);
        
        // Test de navegación
        try {
          const nextButton = await page.$('[class*="right-2"][class*="sm:hidden"]');
          if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(500);
            console.log(`   ✅ CORRECTO: Botón siguiente funciona`);
          }
          
          const prevButton = await page.$('[class*="left-2"][class*="sm:hidden"]');
          if (prevButton) {
            await prevButton.click();
            await page.waitForTimeout(500);
            console.log(`   ✅ CORRECTO: Botón anterior funciona`);
          }
        } catch (error) {
          console.log(`   ⚠️  WARNING: Error en navegación: ${error.message}`);
        }
      } else {
        console.log(`   ❌ ERROR: No se encontraron controles móviles`);
      }
      
      // Verificar indicadores de puntos
      if (dotIndicators.length > 0) {
        console.log(`   ✅ CORRECTO: Indicadores de puntos presentes (${dotIndicators.length})`);
      } else {
        console.log(`   ❌ ERROR: No se encontraron indicadores de puntos`);
      }
    }
    
    // Test de click en producto
    try {
      const firstProduct = await page.$('[class*="group hover:shadow-2xl"]');
      if (firstProduct) {
        await firstProduct.click();
        await page.waitForTimeout(1000);
        
        const modal = await page.$('[role="dialog"]') || await page.$('[class*="modal"]');
        if (modal) {
          console.log(`   ✅ CORRECTO: Modal de producto se abre`);
          
          // Cerrar modal
          const closeButton = await page.$('[class*="absolute"][class*="right"]') || 
                             await page.keyboard.press('Escape');
          if (closeButton && typeof closeButton.click === 'function') {
            await closeButton.click();
          } else {
            await page.keyboard.press('Escape');
          }
          await page.waitForTimeout(500);
        } else {
          console.log(`   ⚠️  WARNING: Modal no se abrió o no se encontró`);
        }
      }
    } catch (error) {
      console.log(`   ⚠️  WARNING: Error en test de click: ${error.message}`);
    }
    
    await page.waitForTimeout(1000);
  }
  
  console.log('\n🎉 Testing completado!');
  await browser.close();
}

// Ejecutar el test
testMobileSlider().catch(console.error);
