Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("d:\HarpreetSingh\RoyalWeaves-boutique\frontend\public\favicon.ico")
$dict = @{}
for($x = 0; $x -lt $img.Width; $x++) {
    for($y = 0; $y -lt $img.Height; $y++) {
        $p = $img.GetPixel($x, $y)
        if ($p.A -gt 100) {
            $hex = "#{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
            if ($dict.ContainsKey($hex)) {
                $dict[$hex]++
            } else {
                $dict[$hex] = 1
            }
        }
    }
}
$dict.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10
