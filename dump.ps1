$base = "C:\Users\Arjun\OneDrive\Desktop\nextjs\lms"
$files = @(
  "app\(dashboard)\dashboard\page.tsx",
  "app\(dashboard)\dashboard\my-courses\page.tsx",
  "app\(dashboard)\dashboard\profile\page.tsx",
  "app\(dashboard)\dashboard\resources\page.tsx",
  "app\(dashboard)\dashboard\sessions\page.tsx",
  "app\(dashboard)\dashboard\recordings\page.tsx",
  "app\(dashboard)\dashboard\learn\[courseId]\page.tsx",
  "app\(main)\courses\page.tsx",
  "app\(main)\courses\[courseId]\page.tsx",
  "app\(admin)\admin\page.tsx",
  "app\(admin)\admin\courses\page.tsx",
  "app\(admin)\admin\students\page.tsx",
  "app\(admin)\admin\sessions\page.tsx",
  "app\(auth)\forgot-password\page.tsx",
  "hooks\useAuth.ts",
  "hooks\useCourse.ts",
  "hooks\useEnrollment.ts",
  "types\index.ts",
  "lib\razorpay.ts",
  "app\api\enroll\route.ts"
)

$output = ""
foreach ($f in $files) {
  $full = Join-Path $base $f
  $output += "===== $f =====`n"
  if (Test-Path $full) {
    $output += (Get-Content $full -Raw)
  } else {
    $output += "[NOT FOUND]"
  }
  $output += "`n`n"
}

$output | Out-File -FilePath "$base\pages_dump.txt" -Encoding utf8
Write-Output "Done! Check pages_dump.txt"