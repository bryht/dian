const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'src/assets/logo.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
    const pngToIco = (await import('png-to-ico')).default;
    
    console.log('Generating icons from logo.svg...\n');

    // Generate PNG icons at various sizes
    const sizes = [16, 32, 64, 128, 256, 512, 1024];
    
    // Create icons folder if it doesn't exist
    const iconsDir = path.join(__dirname, 'assets/icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Generate PNGs for each size
    for (const size of sizes) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(path.join(iconsDir, `${size}x${size}.png`));
        console.log(`✓ Generated icons/${size}x${size}.png`);
    }

    // Generate main icon.png files
    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(__dirname, 'src/assets/icon.png'));
    console.log('✓ Generated src/assets/icon.png (512x512)');

    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(__dirname, 'public/icon.png'));
    console.log('✓ Generated public/icon.png (512x512)');

    // Generate favicon
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(__dirname, 'public/favicon.png'));
    
    // Convert to ICO for favicon
    const faviconPng = fs.readFileSync(path.join(__dirname, 'public/favicon.png'));
    const faviconIco = await pngToIco(faviconPng);
    fs.writeFileSync(path.join(__dirname, 'public/favicon.ico'), faviconIco);
    fs.unlinkSync(path.join(__dirname, 'public/favicon.png')); // Clean up temp png
    console.log('✓ Generated public/favicon.ico');

    // Generate ICO files (Windows) - using multiple sizes
    const icoSizes = [16, 32, 48, 64, 128, 256];
    const icoPngs = [];
    
    for (const size of icoSizes) {
        const pngBuffer = await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toBuffer();
        icoPngs.push(pngBuffer);
    }
    
    const icoBuffer = await pngToIco(icoPngs);
    fs.writeFileSync(path.join(__dirname, 'assets/icon.ico'), icoBuffer);
    console.log('✓ Generated assets/icon.ico');
    
    fs.writeFileSync(path.join(__dirname, 'assets/installerIcon.ico'), icoBuffer);
    console.log('✓ Generated assets/installerIcon.ico');

    // Generate build icon
    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(__dirname, 'build/icon.png'));
    console.log('✓ Generated build/icon.png');

    console.log('\n✅ All icons generated successfully!');
    console.log('\n⚠️  Note: For macOS .icns file, use an online converter or iconutil on macOS:');
    console.log('   https://cloudconvert.com/png-to-icns');
    console.log('   Upload assets/icons/1024x1024.png to generate icon.icns');
}

generateIcons().catch(console.error);
