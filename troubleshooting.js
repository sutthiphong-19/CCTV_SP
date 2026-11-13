import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "@fontsource/kalam/400.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const $ = (selector) => document.querySelector(selector);
let language=localStorage.getItem("cctv-language")==="en"?"en":"th";
const categories = ["Camera Problems", "Network Problems", "Recording Problems", "Installation Problems"];
const categoryTh={"Camera Problems":"ปัญหากล้อง","Network Problems":"ปัญหาเครือข่าย","Recording Problems":"ปัญหาการบันทึก","Installation Problems":"ปัญหาการติดตั้ง"};
const supportCopy={
  en:{
    brandName:"FIELD NOTES",brandSubtitle:"TECHNICAL SUPPORT / 14",navDashboard:"DASHBOARD",navDiagnosis:"DIAGNOSIS",navNetwork:"NETWORK LAB",navTools:"TOOL LAB",navKnowledge:"KNOWLEDGE BASE",backWorkshop:"← WORKSHOP",
    heroEyebrow:"TECHNICIAN'S DIGITAL HANDBOOK",guideNumber:"FIELD GUIDE · 014",heroHeading:"TROUBLESHOOTING<br /><em>CENTER</em>",heroDescription:"A practical, step-by-step guide to diagnosing common CCTV faults.<br />Start with the symptom. Follow the evidence. Work safely.",browseProblems:"BROWSE PROBLEMS",guideReady:"FIELD GUIDE READY",commonFaults:"COMMON FAULTS",
    symptomIndex:"SYMPTOM INDEX / 01",dashboardHeading:"What are you <em>seeing?</em>",diagnosticPaths:"DIAGNOSTIC<br />PATHS",guidedDiagnosis:"GUIDED DIAGNOSIS / 02",workflowHeading:"Camera has <em>no video.</em>",workflowAside:"Follow the signal from the camera<br />to the recorder—one check at a time.",figureA:"FIG. A",restartDiagnosis:"RESTART DIAGNOSIS",
    networkCommands:"NETWORK COMMANDS / 03",networkHeading:"Read the <em>network.</em>",networkAside:"A safe, simulated command-line lab.<br />No commands are run on your device.",consoleTitle:"SIMULATED WINDOWS COMMAND PROMPT",educationalOnly:"EDUCATIONAL ONLY",simAddress:"SIMULATED CAMERA / NVR ADDRESS",runSimulation:"RUN SIMULATION",simulationNote:"SIMULATION ONLY — no network traffic is generated and no real device is contacted.",whatItTells:"WHAT IT TELLS YOU",commonClue:"COMMON CLUE",
    benchEquipment:"BENCH EQUIPMENT / 04",toolsHeading:"Know your <em>tools.</em>",toolsAside:"Select a tool to see a 3D illustration<br />and a safe, basic test procedure.",benchLabel:"BENCH /",interactiveModel:"INTERACTIVE MODEL",toolCanvasAria:"Interactive 3D technician tool illustration",toolOrbit:"DRAG TO ORBIT · SCROLL TO ZOOM",technicianEquipment:"TECHNICIAN EQUIPMENT",basicUse:"BASIC USE",readResult:"READ THE RESULT",
    casebook:"BENCH CASEBOOK / 05",casesHeading:"Five faults. <em>One method.</em>",casesAside:"Realistic scenarios: symptoms, likely causes,<br />and a sensible first response.",searchReference:"SEARCHABLE REFERENCE / 06",knowledgeHeading:"Knowledge, <em>on call.</em>",knowledgeAside:"Search 29 troubleshooting paths and filter<br />by the experience level you need.",searchPlaceholder:"Search symptoms, causes, or solutions…",topicsCount:"29 TOPICS",noResults:"No matching field notes. Try another symptom or difficulty.",
    safetyEyebrow:"SAFETY FIRST / BEFORE YOU BEGIN",safetyHeading:"Protect yourself.<br /><em>Then troubleshoot.</em>",safety1:"Disconnect power before opening equipment or handling internal electrical components.",safety2:"Use appropriately rated electrical test equipment and follow its instructions.",safety3:"Never work on exposed live circuits; refer hazardous electrical work to a qualified technician.",safety4:"Follow the manufacturer's installation, maintenance, and warranty guidance.",
    footerWorkshop:"← INSIDE THE CCTV WORKSHOP",footerGuide:"FIELD NOTES / TECHNICAL SUPPORT <b>·</b> GUIDE 014",backToTop:"BACK TO TOP ↑",closeDiagnosis:"Close diagnosis details",close:"Close",openWorkflow:"OPEN GUIDED DIAGNOSIS",
    categories:{"Camera Problems":"Camera Problems","Network Problems":"Network Problems","Recording Problems":"Recording Problems","Installation Problems":"Installation Problems"},
    allProblems:"ALL PROBLEMS",allLevels:"ALL LEVELS",beginner:"BEGINNER",intermediate:"INTERMEDIATE",advanced:"ADVANCED",causes:"Possible causes",inspection:"Inspection steps",solution:"Practical solutions",tools:"Tools required",prevention:"Prevention",difficulty:"LEVEL",estimated:"EST.",caseLabel:"CASE",likelyCauses:"LIKELY CAUSES",firstResponse:"FIRST RESPONSE",toolResult:"READ THE RESULT",toolPurpose:"TECHNICIAN EQUIPMENT",commandResult:"Select RUN SIMULATION to view an illustrative example.",simulatedAddress:"SIMULATED IP ADDRESS",simIpAria:"Simulated IP address",validIp:"Enter a valid IPv4 address for the simulation (example: 192.168.1.50).",diagnosticStep:"STEP",of:"/",yes:"YES / PASS",no:"NO / FAIL",startAgain:"START AGAIN",noVideo:"no video",simulatedOnly:"SIMULATION ONLY",toolFallback:"3D view unavailable on this device.<br />Tool purpose and safe-use steps are listed alongside.",openPath:"OPEN GUIDED DIAGNOSIS"
  },
  th:{
    brandName:"บันทึกภาคสนาม",brandSubtitle:"ศูนย์สนับสนุนทางเทคนิค / 14",navDashboard:"รายการปัญหา",navDiagnosis:"วินิจฉัยอาการ",navNetwork:"แล็บเครือข่าย",navTools:"เครื่องมือช่าง",navKnowledge:"ฐานความรู้",backWorkshop:"← กลับห้องปฏิบัติการ",
    heroEyebrow:"คู่มือดิจิทัลสำหรับช่างเทคนิค",guideNumber:"คู่มือภาคสนาม · 014",heroHeading:"ศูนย์แก้ไข<br /><em>ปัญหา CCTV</em>",heroDescription:"คู่มือทีละขั้นสำหรับวินิจฉัยปัญหากล้องวงจรปิดที่พบบ่อย<br />เริ่มจากอาการ ตรวจสอบตามหลักฐาน และคำนึงถึงความปลอดภัย",browseProblems:"เลือกดูรายการปัญหา",guideReady:"คู่มือพร้อมใช้งาน",commonFaults:"อาการที่พบบ่อย",
    symptomIndex:"ดัชนีอาการ / 01",dashboardHeading:"คุณกำลัง<em>พบปัญหาอะไร?</em>",diagnosticPaths:"แนวทาง<br />วินิจฉัย",guidedDiagnosis:"วินิจฉัยทีละขั้น / 02",workflowHeading:"กล้อง<em>ไม่มีภาพ</em>",workflowAside:"ไล่ตรวจสัญญาณจากกล้อง<br />ไปยังเครื่องบันทึกทีละจุด",figureA:"แผนภาพ A",restartDiagnosis:"เริ่มวินิจฉัยใหม่",
    networkCommands:"คำสั่งเครือข่าย / 03",networkHeading:"อ่านสัญญาณ<em>เครือข่าย</em>",networkAside:"ห้องทดลองจำลองอย่างปลอดภัย<br />ไม่มีการรันคำสั่งบนอุปกรณ์ของคุณ",consoleTitle:"หน้าต่างคำสั่ง Windows จำลอง",educationalOnly:"เพื่อการเรียนรู้เท่านั้น",simAddress:"ที่อยู่ IP กล้อง / NVR สำหรับจำลอง",runSimulation:"เริ่มการจำลอง",simulationNote:"ผลจำลองเท่านั้น — ไม่มีการส่งข้อมูลบนเครือข่ายและไม่มีการติดต่ออุปกรณ์จริง",whatItTells:"ผลนี้บอกอะไร",commonClue:"ข้อสังเกตที่พบบ่อย",
    benchEquipment:"อุปกรณ์บนโต๊ะช่าง / 04",toolsHeading:"รู้จัก<em>เครื่องมือช่าง</em>",toolsAside:"เลือกเครื่องมือเพื่อดูภาพ 3 มิติ<br />และวิธีทดสอบเบื้องต้นอย่างปลอดภัย",benchLabel:"โต๊ะช่าง /",interactiveModel:"โมเดลโต้ตอบได้",toolCanvasAria:"ภาพเครื่องมือช่าง CCTV แบบ 3 มิติ",toolOrbit:"ลากเพื่อหมุน · เลื่อนเพื่อซูม",technicianEquipment:"อุปกรณ์ช่างเทคนิค",basicUse:"วิธีใช้งานเบื้องต้น",readResult:"อ่านผลการทดสอบ",
    casebook:"กรณีศึกษาหน้างาน / 05",casesHeading:"ห้าอาการ <em>หนึ่งวิธีคิด</em>",casesAside:"สถานการณ์ใกล้เคียงงานจริง: อาการ สาเหตุ<br />และแนวทางตรวจสอบเบื้องต้น",searchReference:"ค้นหาข้อมูลอ้างอิง / 06",knowledgeHeading:"คลังความรู้<em>พร้อมใช้งาน</em>",knowledgeAside:"ค้นหาแนวทางแก้ไข 29 อาการ และกรอง<br />ตามระดับประสบการณ์",searchPlaceholder:"ค้นหาอาการ สาเหตุ หรือวิธีแก้…",topicsCount:"29 หัวข้อ",noResults:"ไม่พบข้อมูล ลองค้นหาอาการหรือเลือกระดับอื่น",
    safetyEyebrow:"ความปลอดภัยต้องมาก่อน / ก่อนเริ่มงาน",safetyHeading:"ปกป้องตัวคุณเอง<br /><em>ก่อนเริ่มตรวจสอบ</em>",safety1:"ตัดแหล่งจ่ายไฟก่อนเปิดอุปกรณ์หรือสัมผัสชิ้นส่วนไฟฟ้าภายในทุกครั้ง",safety2:"ใช้อุปกรณ์ทดสอบไฟฟ้าที่มีพิกัดเหมาะสมและปฏิบัติตามคู่มือ",safety3:"ห้ามทำงานกับวงจรที่มีกระแสไฟเปิดโล่ง งานไฟฟ้าที่มีความเสี่ยงให้ช่างผู้มีคุณสมบัติดำเนินการ",safety4:"ปฏิบัติตามข้อกำหนดการติดตั้ง การบำรุงรักษา และการรับประกันของผู้ผลิต",
    footerWorkshop:"← กลับสู่ห้องปฏิบัติการ CCTV",footerGuide:"บันทึกภาคสนาม / ฝ่ายสนับสนุน <b>·</b> คู่มือ 014",backToTop:"กลับด้านบน ↑",closeDiagnosis:"ปิดรายละเอียดการวินิจฉัย",close:"ปิด",openWorkflow:"เปิดขั้นตอนวินิจฉัย",
    categories:categoryTh,    allProblems:"ปัญหาทั้งหมด",allLevels:"ทุกระดับ",beginner:"เบื้องต้น",intermediate:"ปานกลาง",advanced:"ขั้นสูง",causes:"สาเหตุที่เป็นไปได้",inspection:"ขั้นตอนตรวจสอบ",solution:"แนวทางแก้ไข",tools:"เครื่องมือที่ต้องใช้",prevention:"การป้องกัน",difficulty:"ระดับ",estimated:"เวลาโดยประมาณ",caseLabel:"กรณีศึกษา",likelyCauses:"สาเหตุที่เป็นไปได้",firstResponse:"แนวทางแก้ไขเบื้องต้น",toolResult:"การแปลผล",toolPurpose:"อุปกรณ์ช่างเทคนิค",commandResult:"กดเริ่มการจำลองเพื่อดูตัวอย่างผลลัพธ์",simulatedAddress:"ที่อยู่ IP สำหรับจำลอง",simIpAria:"IP address สำหรับจำลอง",validIp:"กรุณากรอก IPv4 ที่ถูกต้อง (ตัวอย่าง 192.168.1.50)",diagnosticStep:"ขั้นที่",of:"/",yes:"ใช่ / ผ่าน",no:"ไม่ใช่ / ไม่ผ่าน",startAgain:"เริ่มใหม่",noVideo:"ไม่มีภาพ",simulatedOnly:"ผลจำลองเท่านั้น",toolFallback:"อุปกรณ์นี้ไม่รองรับมุมมอง 3 มิติ<br />ยังอ่านวัตถุประสงค์และวิธีใช้งานอย่างปลอดภัยได้",openPath:"เปิดขั้นตอนวินิจฉัย"
  }
};
const commonInspection = {
  "Camera Problems": [
    "Confirm the symptom at the camera and at the recorder; note when it started and whether it affects one or multiple channels.",
    "Check the relevant power, cable, lens, lighting, and configuration indicators without opening energized equipment.",
    "Change one variable at a time: use a known-good cable, compatible channel, or approved supply where appropriate."
  ],
  "Network Problems": [
    "Record the camera IP, subnet, gateway, switch port, and NVR network settings before changing anything.",
    "Inspect link/activity LEDs and cable seating at both ends; verify PoE class and switch-port budget from device documentation.",
    "Check for duplicate IPs, VLAN/firewall boundaries, and compatible subnet settings with the network administrator."
  ],
  "Recording Problems": [
    "Check recorder status, recording schedule, channel state, storage health, capacity, and current system time.",
    "Review event logs and a known-good channel/time window; distinguish live video from recorded playback.",
    "Use recorder diagnostics and vendor-supported storage checks before changing or replacing a disk."
  ],
  "Installation Problems": [
    "Compare the installation with the camera, cable, connector, and switch specifications.",
    "Check the termination, cable route, environmental seal, camera aim, and visible link/power indicators.",
    "Test a short known-good cable or channel first; change one installation variable at a time."
  ]
};
const commonPrevention = {
  "Camera Problems": "Keep the lens clean, use a correctly rated stable supply, protect the camera from heat and moisture, and log firmware/configuration changes.",
  "Network Problems": "Use a documented IP plan, label both cable ends, verify switch PoE capacity, and keep a port/VLAN map with configuration backups.",
  "Recording Problems": "Use supported surveillance-rated storage, configure retention and time sync, monitor disk health, and periodically verify recorded playback.",
  "Installation Problems": "Follow manufacturer limits, test each run before mounting, use correct termination and weather seals, and document aim, port, and cable route."
};
const issueRows = [
  ["Camera ไม่ติด / ไม่มีไฟ","Camera Not Powering On","No power indicator or camera link; the camera does not start.","Power adapter or PoE port has no output; loose or damaged power lead; incorrect voltage/polarity; failed camera input.","Confirm the rated supply and connection, then test the outlet/PoE port with a suitable meter or tester. Substitute only a known-good, manufacturer-approved supply.","Beginner","10–20 min","ϟ","Camera Problems"],
  ["ภาพไม่ขึ้น","No Video Signal","The camera channel is blank, reports no signal, or is missing from live view.","Disconnected or damaged cable; wrong recorder input/channel; unsupported video standard/resolution; camera not initialized.","Reseat both ends, confirm the selected channel and compatible format, then test the camera on a known-good input/cable.","Beginner","10–20 min","▣","Camera Problems"],
  ["ภาพดำ","Black Screen","A channel is present but the image is completely or nearly black.","Lens cap or blocked lens; exposure/night-mode configuration; failed IR-cut mechanism; insufficient light or power.","Check the lens and exposure settings, test in safe ambient light, and compare day/night behavior without opening the unit.","Beginner","10–15 min","◐","Camera Problems"],
  ["ภาพเบลอ","Blurry Image","The live or recorded image lacks focus or appears hazy.","Dirty or fogged cover glass; focus/zoom adjustment; condensation; incorrect focus distance.","Clean the outer cover with an approved cloth, inspect for condensation, and focus on a target at the intended distance.","Beginner","10–15 min","◎","Camera Problems"],
  ["ภาพกระตุก","Lagging or Freezing","Video freezes, drops frames, or arrives with delay.","Insufficient uplink or recorder throughput; packet loss; excessive bitrate/resolution; overloaded client or storage.","Compare local live view, recorder load, stream bitrate, and switch-port errors; test one camera at a time.","Intermediate","15–30 min","»","Camera Problems"],
  ["ภาพมีสัญญาณรบกวน","Noisy Image","The image has grain, lines, flicker, or intermittent interference.","Low illumination/gain; unstable supply; poor grounding or cable shielding; analog interference or compression artifacts.","Compare day/night and live/recorded image, inspect power and cable route, and adjust exposure only within the camera's supported range.","Intermediate","15–25 min","≋","Camera Problems"],
  ["กล้องไม่ทำงานตอนกลางคืน","Night Vision Failure","The camera is usable by day but becomes dark or unusable at night.","IR LEDs disabled/failed; light sensor blocked; IR-cut filter stuck; insufficient supply for night-mode load.","Check night mode and the IR indicator in darkness, inspect the window for obstruction, and verify supply rating under load.","Intermediate","15–30 min","☾","Camera Problems"],
  ["กล้องร้อนผิดปกติ","Camera Overheating","The housing is unusually hot, reboots, or shuts down in service.","Direct sun or poor ventilation; supply outside rating; water ingress; internal fault or ambient temperature beyond specification.","Compare ambient temperature and manufacturer's operating range, inspect mounting/ventilation and supply rating, and isolate power if there is odor or deformation.","Intermediate","10–20 min","♨","Camera Problems"],

  ["กล้อง IP ไม่สามารถเชื่อมต่อเครือข่ายได้","IP Camera Cannot Join Network","The IP camera has no expected network link or is not reachable on the intended LAN.","Wrong subnet/VLAN; disabled switch port; incorrect static settings; failed termination; DHCP unavailable.","Verify link LEDs and port/VLAN, compare IP/subnet/gateway to the site plan, and test with a known-good patch lead.","Intermediate","15–30 min","⌁","Network Problems"],
  ["IP Address Conflict","IP Address Conflict","Connectivity is intermittent or an address-conflict warning appears.","Two devices use the same static IP; DHCP pool overlaps static assignments; stale reservation.","Check the approved IP inventory and DHCP reservations with the administrator; isolate and identify the conflicting endpoint before reassigning.","Intermediate","15–25 min","⇄","Network Problems"],
  ["กล้อง Offline","Camera Offline","The camera appears offline in the NVR or VMS although its configuration remains listed.","Power/PoE loss; disconnected link; IP change/conflict; credentials or service issue; routing/VLAN change.","Check switch port and power first, then verify the recorded IP/subnet, reachability from the correct VLAN, and NVR connection settings.","Beginner","10–25 min","⊘","Network Problems"],
  ["เชื่อมต่อ NVR ไม่ได้","Cannot Connect to NVR","The camera or client cannot establish a session with the recorder.","Wrong address/port; network segmentation; service disabled; credentials or firmware mismatch.","Confirm the NVR address and service status locally, then check allowed ports and network path with the system administrator.","Intermediate","15–30 min","▣","Network Problems"],
  ["ดูภาพผ่านมือถือไม่ได้","Mobile Remote View Unavailable","Local viewing works but the mobile app cannot connect remotely.","No internet at site; DNS/gateway issue; app/account configuration; cloud/P2P service unavailable; firewall policy.","Confirm local live view and site internet independently, check app/account and recorder online status, and verify remote-access policy.","Intermediate","15–30 min","▧","Network Problems"],
  ["LAN Cable ไม่มีสัญญาณ","LAN Cable Has No Link","Switch port shows no link or a cable tester reports an open/short/miswire.","Poor crimp; damaged cable; wrong pinout; broken pair; bad patch lead or port.","Inspect both terminations and use a cable tester; replace with a known-good lead to distinguish cable from port.","Beginner","10–20 min","⌁","Network Problems"],
  ["PoE Switch จ่ายไฟไม่เพียงพอ","PoE Switch Power Budget Insufficient","Camera reboots, fails to start IR, or a switch reports a PoE budget/port fault.","Total switch PoE budget exceeded; port class mismatch; long/lossy cable; unsupported injector or faulty port.","Compare camera PoE class and switch budget/port status with the datasheets; test one camera on a known-good supported port.","Intermediate","15–25 min","ϟ","Network Problems"],
  ["Network Connection Unstable","Unstable Network Connection","Camera packets or live video drop intermittently while power may remain stable.","Damaged/poor cable; port errors; congestion; duplex/VLAN changes; unstable switch power.","Review port error counters and link state, check the complete cable path, and compare during a low-load test window.","Advanced","20–40 min","⌁","Network Problems"],

  ["DVR / NVR ไม่บันทึกภาพ","DVR / NVR Not Recording","Live view works but new footage is absent or recording state is inactive.","Recording schedule or channel disabled; storage unavailable/full; motion rules; clock/time mismatch.","Check recording schedule, channel status, disk health/capacity, and time zone; search a known recent interval.","Beginner","10–20 min","▣","Recording Problems"],
  ["HDD ไม่พบในระบบ","HDD Not Detected","The recorder reports no disk or storage unavailable.","SATA or power lead loose; unsupported disk; disk failure; recorder bay/port issue.","Shut down and disconnect mains power before opening the recorder; reseat approved connections and check supported-drive documentation.","Intermediate","20–40 min","▤","Recording Problems"],
  ["Playback ย้อนหลังไม่ได้","Playback Unavailable","Recorded timeline or search results are empty despite an apparently working camera.","No recording schedule; wrong date/time/time zone; retention overwrite; selected channel/filter mismatch.","Verify recorder clock and channel schedule, then search a short interval known to have recording activity.","Beginner","10–20 min","◷","Recording Problems"],
  ["ภาพบันทึกไม่ครบ","Incomplete Recordings","Footage has gaps or recording starts/stops unexpectedly.","Motion/event-only schedule; network loss; insufficient throughput; storage errors; time drift.","Compare event logs, disk health and camera connection events against the recording schedule and timeline.","Intermediate","20–35 min","▥","Recording Problems"],
  ["Storage เต็ม","Storage Full","The recorder reports low or exhausted recording capacity.","Retention target exceeds disk capacity; overwrite disabled; excessive bitrate or channel count.","Review retention/overwrite configuration and per-camera bitrate; calculate the required retention before changing settings.","Intermediate","15–25 min","▤","Recording Problems"],
  ["เวลาและวันที่ในระบบไม่ถูกต้อง","System Date or Time Is Incorrect","Recorded timestamps do not match actual event time or search windows.","Wrong time zone/daylight-saving setting; NTP unavailable; manual clock drift; incorrect camera/recorder sync.","Check time zone and NTP source on the recorder and cameras; compare a documented reference time and verify sync status.","Beginner","10–20 min","◷","Recording Problems"],

  ["กล้องไม่มีภาพหลังติดตั้ง","No Image After Installation","A newly installed camera does not display at the monitor or NVR.","Wrong input/format; loose termination; incorrect aim or lens cap; incompatible power/network settings.","Test the camera at the recorder using a short known-good cable and verify channel format and addressing before reinstalling.","Beginner","15–30 min","▣","Installation Problems"],
  ["เข้าหัว RJ45 แล้วใช้งานไม่ได้","RJ45 Termination Does Not Work","A newly crimped Ethernet cable has no link or fails a wire-map test.","Incorrect T568A/B mapping; split pair; poor contact; conductor stripped too far; incompatible connector for cable type.","Choose and match the site's termination standard at both ends, inspect the wire map, and recrimp using a connector matched to conductor type.","Beginner","15–25 min","⌁","Installation Problems"],
  ["สาย LAN ระยะไกลเกินไป","LAN Cable Run Too Long","Link is unreliable or power/video fails on a long cable run.","Run exceeds Ethernet channel limits; excessive PoE voltage drop; poor cable grade; intermediate connections.","Measure the installed channel length, check the camera and cable specifications, and plan a compliant switch/repeater/fiber segment.","Intermediate","20–40 min","↔","Installation Problems"],
  ["กล้องไม่มีไฟจาก PoE","Camera Receives No PoE Power","A camera does not boot from a PoE switch or injector.","Non-PoE port; disabled/failed port; incompatible PoE standard; insufficient budget; bad cable pairs.","Confirm the port supports the camera's required PoE type, inspect port status/budget, and validate cable wire-map with a compatible tester.","Beginner","10–20 min","ϟ","Installation Problems"],
  ["ภาพสะท้อนจาก Infrared LED","IR Reflection / Night Glare","Night images show a bright halo, haze, or nearby reflection.","IR reflects from a wall/eave, dirty dome, protective film, or insect/web near the lens.","Clean the lens cover, remove installation film, reposition away from reflective surfaces, and test night mode after dusk.","Beginner","10–20 min","☾","Installation Problems"],
  ["ภาพย้อนแสง","Backlit Image","A subject appears dark when bright light or a window is behind it.","Camera faces a bright background; WDR/BLC/HLC disabled or poorly tuned; exposure region misselected.","Re-aim if possible and test WDR/BLC settings using the intended scene; compare exposure without losing required detail.","Beginner","10–20 min","◐","Installation Problems"],
  ["ตำแหน่งติดตั้งกล้องไม่เหมาะสม","Camera Position Is Unsuitable","Important areas are obscured, poorly framed, or outside effective night coverage.","Mount too high/low; wrong lens/FOV; glare, vibration, obstruction, or privacy-zone conflict.","Review the required coverage and privacy constraints, adjust the view, and validate day/night image at representative distances.","Beginner","20–40 min","⌖","Installation Problems"]
];
const thaiIssueInfo=[
  ["กล้องไม่ติด / ไม่มีไฟ","ไม่มีไฟแสดงสถานะหรือสัญญาณลิงก์ กล้องไม่เริ่มทำงาน","อะแดปเตอร์หรือพอร์ต PoE ไม่มีไฟ; สายไฟหลวมหรือชำรุด; แรงดันหรือขั้วไฟไม่ถูกต้อง; อินพุตกล้องเสีย","ตรวจสอบพิกัดไฟและการเชื่อมต่อ แล้วทดสอบแหล่งจ่ายด้วยมิเตอร์หรือเครื่องทดสอบที่เหมาะสม ใช้แหล่งจ่ายทดแทนที่ผู้ผลิตรับรองเท่านั้น"],
  ["ภาพไม่ขึ้น / ไม่มีสัญญาณวิดีโอ","ช่องกล้องว่าง แสดงว่าไม่มีสัญญาณ หรือไม่ปรากฏในภาพสด","สายหลุดหรือชำรุด; เลือกช่องเครื่องบันทึกผิด; มาตรฐานหรือความละเอียดไม่รองรับ; กล้องยังไม่เริ่มทำงาน","เสียบสายทั้งสองด้านให้แน่น ตรวจช่องสัญญาณและรูปแบบวิดีโอที่รองรับ แล้วลองสายหรืออินพุตที่ทราบว่าใช้งานได้"],
  ["ภาพดำ","มีช่องภาพแต่ภาพมืดสนิทหรือเกือบมองไม่เห็น","ยังไม่ถอดฝาครอบเลนส์หรือมีสิ่งบัง; ตั้งค่าแสงหรือโหมดกลางคืนไม่เหมาะสม; กลไก IR-Cut ขัดข้อง; แสงหรือไฟเลี้ยงไม่พอ","ตรวจเลนส์และค่าการรับแสง ทดสอบในบริเวณที่มีแสงอย่างปลอดภัย และเปรียบเทียบโหมดกลางวัน/กลางคืนโดยไม่เปิดตัวเครื่อง"],
  ["ภาพเบลอ","ภาพสดหรือภาพบันทึกไม่คมชัดหรือดูขุ่น","กระจกหน้าเลนส์สกปรกหรือเป็นฝ้า; โฟกัสหรือซูมไม่เหมาะสม; มีไอน้ำ; ระยะโฟกัสไม่ตรง","เช็ดกระจกภายนอกด้วยผ้าที่เหมาะสม ตรวจความชื้น และปรับโฟกัสโดยเล็งเป้าหมายในระยะใช้งานจริง"],
  ["ภาพกระตุก / ค้าง","ภาพหยุดเป็นช่วง เฟรมหาย หรือมีความหน่วง","แบนด์วิดท์ขาออกหรือกำลังประมวลผลเครื่องบันทึกไม่พอ; แพ็กเก็ตสูญหาย; บิตเรตหรือความละเอียดสูงเกินไป; เครื่องลูกข่ายหรือที่จัดเก็บทำงานหนัก","เปรียบเทียบภาพสดในระบบกับโหลดเครื่องบันทึกและบิตเรต ตรวจข้อผิดพลาดพอร์ตสวิตช์ และทดสอบทีละกล้อง"],
  ["ภาพมีสัญญาณรบกวน","ภาพเป็นเม็ด มีเส้น กะพริบ หรือมีสัญญาณแทรกเป็นช่วง","แสงน้อยหรือเร่งเกนสูง; ไฟเลี้ยงไม่นิ่ง; การต่อลงกราวด์หรือชีลด์ไม่ดี; สัญญาณรบกวนหรือการบีบอัดภาพ","เปรียบเทียบภาพกลางวัน/กลางคืนและภาพสด/บันทึก ตรวจไฟเลี้ยงกับแนวสาย และปรับแสงภายในช่วงที่ผู้ผลิตกำหนด"],
  ["กล้องไม่ทำงานตอนกลางคืน","กลางวันใช้งานได้ แต่กลางคืนภาพมืดหรือใช้งานไม่ได้","ปิดหรือหลอด IR เสีย; เซนเซอร์แสงถูกบัง; ฟิลเตอร์ IR-Cut ค้าง; ไฟเลี้ยงไม่พอเมื่อเข้าโหมดกลางคืน","ตรวจโหมดกลางคืนและไฟแสดง IR ในที่มืด ตรวจสิ่งบังหน้าเลนส์ และตรวจพิกัดไฟเลี้ยงขณะรับโหลด"],
  ["กล้องร้อนผิดปกติ","ตัวกล้องร้อนมาก รีสตาร์ต หรือหยุดทำงานระหว่างใช้งาน","โดนแดดหรือระบายอากาศไม่ดี; ไฟเลี้ยงไม่ตรงพิกัด; มีน้ำเข้า; อุณหภูมิแวดล้อมเกินข้อกำหนดหรืออุปกรณ์ภายในขัดข้อง","เทียบอุณหภูมิแวดล้อมกับช่วงใช้งานของผู้ผลิต ตรวจตำแหน่งติดตั้งและไฟเลี้ยง และตัดไฟหากมีกลิ่นไหม้หรือชิ้นส่วนผิดรูป"],
  ["กล้อง IP เชื่อมต่อเครือข่ายไม่ได้","กล้องไม่มีลิงก์เครือข่ายหรือเข้าถึงไม่ได้บน LAN ที่กำหนด","อยู่คนละซับเน็ตหรือ VLAN; ปิดพอร์ตสวิตช์; ตั้ง IP คงที่ผิด; เข้าหัวสายไม่ดี; ไม่มี DHCP","ตรวจไฟลิงก์และ VLAN เทียบ IP/ซับเน็ต/เกตเวย์กับแผนระบบ และลองสายแพตช์ที่ทราบว่าใช้งานได้"],
  ["IP Address ซ้ำ","การเชื่อมต่อขาด ๆ หาย ๆ หรือมีแจ้งเตือน IP ซ้ำ","อุปกรณ์สองตัวใช้ IP คงที่เดียวกัน; ช่วง DHCP ทับกับ IP คงที่; รายการจอง IP เก่าค้างอยู่","ตรวจทะเบียน IP และรายการ DHCP กับผู้ดูแลระบบ ระบุอุปกรณ์ที่ชนกันก่อนเปลี่ยนค่า IP"],
  ["กล้องออฟไลน์","กล้องแสดงสถานะออฟไลน์ใน NVR/VMS ทั้งที่ยังมีรายการตั้งค่า","ไฟหรือ PoE หาย; สายเครือข่ายหลุด; IP เปลี่ยนหรือซ้ำ; บัญชีหรือบริการมีปัญหา; เส้นทางหรือ VLAN เปลี่ยน","ตรวจพอร์ตสวิตช์และไฟก่อน จากนั้นตรวจ IP/ซับเน็ต การเข้าถึงจาก VLAN ที่ถูกต้อง และค่าการเชื่อมต่อ NVR"],
  ["เชื่อมต่อ NVR ไม่ได้","กล้องหรือเครื่องลูกข่ายสร้างการเชื่อมต่อกับเครื่องบันทึกไม่ได้","ที่อยู่หรือพอร์ตผิด; เครือข่ายถูกแบ่งส่วน; ปิดบริการ; ข้อมูลบัญชีหรือเฟิร์มแวร์ไม่เข้ากัน","ตรวจที่อยู่ NVR และสถานะบริการในพื้นที่ แล้วตรวจพอร์ตที่อนุญาตและเส้นทางเครือข่ายกับผู้ดูแลระบบ"],
  ["ดูภาพผ่านมือถือไม่ได้","ดูภาพในพื้นที่ได้ แต่แอปมือถือเชื่อมต่อจากภายนอกไม่ได้","อินเทอร์เน็ตหน้างานขัดข้อง; ตั้งค่าเราเตอร์หรือ DNS; บัญชีหรือแอปไม่ถูกต้อง; บริการคลาวด์/P2P ไม่พร้อม","ยืนยันภาพในพื้นที่และอินเทอร์เน็ตแยกกัน ตรวจสถานะออนไลน์ของแอป/เครื่องบันทึก และตรวจนโยบายการเข้าถึงระยะไกล"],
  ["สาย LAN ไม่มีสัญญาณ","พอร์ตสวิตช์ไม่ขึ้นลิงก์หรือเครื่องทดสอบแจ้งสายขาด/ลัดวงจร/เรียงสายผิด","เข้าหัวไม่ดี; สายชำรุด; ใช้ผังขาไม่ตรงกัน; คู่สายขาด; สายแพตช์หรือพอร์ตเสีย","ตรวจหัวสายทั้งสองด้านและทดสอบสาย เปลี่ยนเป็นสายที่ทราบว่าใช้งานได้เพื่อแยกปัญหาระหว่างสายกับพอร์ต"],
  ["PoE Switch จ่ายไฟไม่พอ","กล้องรีสตาร์ต เข้าโหมดอินฟราเรดไม่ได้ หรือสวิตช์แจ้งงบ PoE/พอร์ตผิดปกติ","งบไฟรวมของสวิตช์เกิน; คลาส PoE ไม่ตรงกัน; สายยาวหรือสูญเสียสูง; ใช้อินเจกเตอร์ไม่รองรับหรือพอร์ตเสีย","เทียบคลาส PoE และงบไฟสวิตช์กับเอกสารอุปกรณ์ แล้วทดสอบกล้องหนึ่งตัวบนพอร์ตที่รองรับและทราบว่าใช้งานได้"],
  ["เครือข่ายไม่เสถียร","แพ็กเก็ตกล้องหรือภาพสดขาดช่วง แม้ไฟเลี้ยงอาจยังปกติ","สายชำรุดหรือเข้าหัวไม่ดี; พอร์ตมีข้อผิดพลาด; เครือข่ายหนาแน่น; เปลี่ยน VLAN/ดูเพล็กซ์; ไฟสวิตช์ไม่นิ่ง","ตรวจตัวนับข้อผิดพลาดและสถานะลิงก์ ตรวจสายทั้งเส้น และเปรียบเทียบช่วงที่เครือข่ายมีโหลดต่ำ"],
  ["DVR / NVR ไม่บันทึกภาพ","ดูภาพสดได้แต่ไม่มีภาพใหม่ถูกบันทึกหรือสถานะบันทึกไม่ทำงาน","ปิดตารางบันทึกหรือช่องกล้อง; ที่จัดเก็บไม่พร้อมหรือเต็ม; ตั้งค่าตรวจจับเหตุการณ์; เวลาเครื่องไม่ตรง","ตรวจตารางบันทึก สถานะช่อง สุขภาพ/ความจุดิสก์ และเขตเวลา จากนั้นค้นหาช่วงเวลาล่าสุดที่ทราบว่ามีการบันทึก"],
  ["ไม่พบ HDD ในระบบ","เครื่องบันทึกแจ้งว่าไม่มีดิสก์หรือไม่พร้อมใช้งาน","สาย SATA หรือไฟเลี้ยงหลวม; ดิสก์ไม่รองรับ; ดิสก์เสีย; ช่องใส่หรือพอร์ตเครื่องบันทึกผิดปกติ","ปิดและถอดปลั๊กก่อนเปิดเครื่อง ตรวจการเชื่อมต่อที่ได้รับอนุมัติและเอกสารดิสก์ที่รองรับ"],
  ["เปิดดูย้อนหลังไม่ได้","ไทม์ไลน์หรือผลค้นหาว่างเปล่า แม้กล้องดูเหมือนทำงานปกติ","ไม่มีตารางบันทึก; วันที่/เขตเวลาผิด; บันทึกทับตามอายุข้อมูล; เลือกช่องหรือตัวกรองผิด","ตรวจนาฬิกาเครื่องบันทึกและตารางช่องกล้อง แล้วค้นหาช่วงเวลาสั้น ๆ ที่ทราบว่ามีข้อมูล"],
  ["ภาพบันทึกไม่ครบ","ไฟล์วิดีโอมีช่วงขาดหรือการบันทึกเริ่มและหยุดเอง","ตั้งบันทึกเฉพาะเมื่อมีการเคลื่อนไหว; เครือข่ายหลุด; ส่งข้อมูลไม่ทัน; ดิสก์มีปัญหา; เวลาเหลื่อม","เทียบ log เหตุการณ์ สุขภาพดิสก์ และเหตุการณ์กล้องหลุดกับตารางบันทึก"],
  ["พื้นที่จัดเก็บเต็ม","เครื่องบันทึกแจ้งพื้นที่เหลือน้อยหรือเต็ม","กำหนดระยะเก็บนานเกินความจุ; ปิดการเขียนทับ; บิตเรตหรือจำนวนกล้องสูงเกินไป","ตรวจระยะเก็บและการเขียนทับ คำนวณพื้นที่ที่ต้องใช้ก่อนเปลี่ยนค่าการบันทึก"],
  ["เวลาและวันที่ในระบบไม่ถูกต้อง","เวลาในภาพบันทึกไม่ตรงกับเหตุการณ์จริงหรือช่วงค้นหา","เขตเวลาหรือเวลาออมแสงผิด; NTP ใช้ไม่ได้; นาฬิกาตั้งเองคลาดเคลื่อน; กล้องกับเครื่องบันทึกไม่ซิงก์","ตรวจเขตเวลาและแหล่ง NTP บนเครื่องบันทึกกับกล้อง เทียบเวลามาตรฐานและยืนยันสถานะซิงก์"],
  ["ติดตั้งกล้องแล้วไม่มีภาพ","กล้องที่เพิ่งติดตั้งไม่แสดงภาพที่จอหรือ NVR","เลือกอินพุต/รูปแบบผิด; หัวสายหลวม; เลือกมุมเล็งผิดหรือลืมฝาครอบเลนส์; ไฟหรือเครือข่ายตั้งค่าไม่ถูก","ทดสอบกล้องกับเครื่องบันทึกโดยใช้สายสั้นที่ทราบว่าใช้ได้ และตรวจรูปแบบช่อง/การกำหนด IP ก่อนติดตั้งกลับ"],
  ["เข้าหัว RJ45 แล้วใช้งานไม่ได้","สายที่เข้าหัวใหม่ไม่มีลิงก์หรือทดสอบผังสายไม่ผ่าน","เรียงสายตาม T568A/B ไม่ตรงกัน; คู่สายแยก; หน้าสัมผัสไม่ดี; ปอกสายมากเกินไป; หัวต่อไม่เหมาะกับสาย","เลือกมาตรฐานเดียวกันทั้งสองด้าน ตรวจผังสายและเข้าหัวใหม่ด้วยคอนเน็กเตอร์ที่เหมาะกับชนิดตัวนำ"],
  ["สาย LAN ระยะไกลเกินไป","ลิงก์ไม่เสถียร หรือไฟ/วิดีโอขาดเมื่อใช้สายระยะไกล","ความยาวเกินข้อกำหนดช่องสัญญาณอีเทอร์เน็ต; แรงดัน PoE ตก; เกรดสายไม่เหมาะ; มีจุดต่อกลางทาง","วัดความยาวช่องสัญญาณทั้งหมด ตรวจข้อกำหนดกล้องและสาย แล้ววางแผนใช้สวิตช์ รีพีตเตอร์ หรือไฟเบอร์ที่ถูกต้อง"],
  ["กล้องไม่ได้รับไฟจาก PoE","กล้องไม่บูตเมื่อใช้ PoE Switch หรืออินเจกเตอร์","พอร์ตไม่รองรับ PoE; ปิดหรือพอร์ตเสีย; มาตรฐาน PoE ไม่ตรง; งบไฟไม่พอ; คู่สายในสายเสีย","ยืนยันชนิด PoE ที่พอร์ตรองรับ ตรวจสถานะและงบไฟ และทดสอบผังสายด้วยเครื่องมือที่เข้ากันได้"],
  ["ภาพอินฟราเรดสะท้อน / ภาพกลางคืนฟุ้ง","ภาพกลางคืนเกิดวงแสงขาว ฟุ้ง หรือมีแสงสะท้อนใกล้กล้อง","IR สะท้อนจากผนังหรือชายคา; ฝาครอบโดมสกปรก; ยังมีฟิล์มป้องกัน; มีแมลงหรือใยแมงมุมหน้าเลนส์","เช็ดฝาครอบเลนส์ ลอกฟิล์มติดตั้ง ปรับตำแหน่งหนีพื้นผิวสะท้อน และทดสอบโหมดกลางคืนหลังฟ้ามืด"],
  ["ภาพย้อนแสง","ตัวแบบมืดเมื่อมีหน้าต่างหรือแสงจ้าอยู่ด้านหลัง","กล้องหันเข้าหาฉากสว่าง; ปิดหรือตั้ง WDR/BLC/HLC ไม่เหมาะ; เลือกพื้นที่วัดแสงผิด","ปรับมุมกล้องหากทำได้ และทดสอบ WDR/BLC กับฉากจริง โดยรักษารายละเอียดสำคัญของภาพ"],
  ["ตำแหน่งติดตั้งกล้องไม่เหมาะสม","พื้นที่สำคัญถูกบัง มุมภาพไม่เหมาะ หรืออยู่นอกระยะอินฟราเรด","ติดตั้งสูงหรือต่ำเกินไป; เลนส์หรือมุมมองไม่ตรงงาน; แสงแยงตา กล้องสั่น มีสิ่งบัง หรือขัดข้อกำหนดความเป็นส่วนตัว","ทบทวนพื้นที่ครอบคลุมและข้อกำหนดความเป็นส่วนตัว ปรับมุมกล้อง แล้วทดสอบภาพกลางวัน/กลางคืนในระยะใช้งานจริง"]
];
const commonInspectionTh={
  "Camera Problems":["ยืนยันอาการที่ตัวกล้องและเครื่องบันทึก จดเวลาที่เริ่มเกิดและตรวจว่าได้รับผลกระทบหนึ่งช่องหรือหลายช่อง","ตรวจไฟ สาย เลนส์ แสง และค่าตั้งที่เกี่ยวข้องโดยไม่เปิดอุปกรณ์ที่ยังมีกระแสไฟ","เปลี่ยนตัวแปรทีละอย่าง เช่น ใช้สายที่ทราบว่าใช้ได้ ช่องที่รองรับ หรือแหล่งจ่ายที่ผู้ผลิตรับรอง"],
  "Network Problems":["จด IP กล้อง ซับเน็ต เกตเวย์ พอร์ตสวิตช์ และค่าระบบเครือข่ายของ NVR ก่อนปรับเปลี่ยน","ตรวจไฟลิงก์/กิจกรรมและการเสียบสายทั้งสองด้าน เทียบคลาส PoE กับงบไฟตามเอกสารอุปกรณ์","ตรวจ IP ซ้ำ ขอบเขต VLAN/ไฟร์วอลล์ และซับเน็ตกับผู้ดูแลระบบ"],
  "Recording Problems":["ตรวจสถานะเครื่อง ตารางบันทึก ช่อง สุขภาพดิสก์ ความจุ และเวลาปัจจุบัน","ดูบันทึกเหตุการณ์และช่วงเวลาที่ทราบว่าปกติ แยกภาพสดออกจากการเปิดย้อนหลัง","ใช้การวินิจฉัยของเครื่องและเครื่องมือตรวจดิสก์ที่ผู้ผลิตรองรับก่อนเปลี่ยนดิสก์"],
  "Installation Problems":["เทียบงานติดตั้งกับข้อกำหนดกล้อง สาย คอนเน็กเตอร์ และสวิตช์","ตรวจหัวสาย แนวเดินสาย ซีลกันสภาพอากาศ มุมกล้อง และไฟสถานะลิงก์/ไฟเลี้ยง","ลองสายสั้นที่ทราบว่าใช้ได้หรือช่องอื่นก่อน และเปลี่ยนทีละปัจจัย"]
};
const commonPreventionTh={
  "Camera Problems":"รักษาความสะอาดเลนส์ ใช้ไฟเลี้ยงที่เสถียรและตรงพิกัด ป้องกันความร้อน/ความชื้น และบันทึกการเปลี่ยนเฟิร์มแวร์หรือค่าตั้ง",
  "Network Problems":"จัดทำแผน IP ติดป้ายสายทั้งสองด้าน ตรวจงบ PoE และเก็บผังพอร์ต/VLAN พร้อมสำรองค่าตั้ง",
  "Recording Problems":"ใช้ดิสก์ที่รองรับงานกล้อง ตั้งระยะเก็บและซิงก์เวลา เฝ้าระวังสุขภาพดิสก์ และทดสอบเปิดภาพย้อนหลังเป็นระยะ",
  "Installation Problems":"ทำตามข้อกำหนดผู้ผลิต ทดสอบสายก่อนติดตั้ง ใช้หัวและซีลที่ถูกต้อง และบันทึกมุมกล้อง พอร์ต และเส้นทางสาย"
};
const toolSetsTh={
  "Camera Problems":["อะแดปเตอร์ไฟ มิเตอร์ดิจิทัล (สำหรับผู้มีคุณสมบัติ) สายแพตช์ที่ทราบว่าใช้ได้ และผ้าเช็ดเลนส์","วัดเฉพาะด้านแรงดันต่ำที่แยกวงจรแล้วตามความเหมาะสม ตัดไฟก่อนเปิดอุปกรณ์"],
  "Network Problems":["เครื่องทดสอบสาย LAN เครื่องทดสอบ PoE ที่รองรับมาตรฐาน และแล็ปท็อปพร้อมเครื่องมือที่ได้รับอนุมัติ","ห้ามต่อเครื่องมือกับวงจรที่ไม่ทราบสถานะหรือยังมีกระแสไฟ ประสานผู้ดูแลก่อนเปลี่ยน VLAN หรือ IP"],
  "Recording Problems":["หน้าสถานะ/ล็อกเครื่องบันทึก เครื่องมือตรวจดิสก์ที่รองรับ จอทดสอบ และเวลามาตรฐาน","ปิดเครื่องและถอดปลั๊กก่อนสัมผัส HDD หรือสาย SATA สำรองไฟล์บันทึกและค่าตั้งก่อนซ่อม"],
  "Installation Problems":["เครื่องทดสอบผังสาย LAN คีมเข้าหัว RJ45 พร้อมหัวต่อ เครื่องทดสอบ PoE และจอหรือแล็ปท็อปตามงาน","ใช้บันไดและ PPE ที่เหมาะสม ตัดไฟก่อนเข้าหัวสายใหม่ และซีลจุดต่อภายนอกอาคาร"]
};
const toolSafetyTh="ปฏิบัติตามข้อกำหนดความปลอดภัยและคู่มืออุปกรณ์ ตัดไฟก่อนเปิดเครื่องหรือจับสายภายใน และส่งต่องานที่เสี่ยงให้ช่างผู้มีคุณสมบัติ";
const toolSets = {
  "Camera Problems": ["Power adapter, digital multimeter (qualified use), known-good patch lead, lens cloth", "Keep test leads and probe points on the isolated low-voltage side; disconnect power before opening equipment."],
  "Network Problems": ["LAN cable tester, PoE tester compatible with the standard, laptop with approved network tools", "Do not connect a tester or laptop to an unknown/energized circuit; coordinate VLAN and address changes with the network owner."],
  "Recording Problems": ["Recorder status/log interface, supported storage diagnostics, service monitor, system clock reference", "Power down and unplug before handling internal HDD or SATA connections; preserve recordings and configuration before service."],
  "Installation Problems": ["LAN wire-map tester, RJ45 crimper/connectors, PoE tester, monitor or laptop as appropriate", "Use an appropriate ladder and PPE; isolate power before re-terminating, and weather-seal outdoor joints."]
};
const helpIcons = ["ϟ","▣","◐","◎","»","≋","☾","♨","⌁","⇄","⊘","▣","▧","⌁","ϟ","⌁","▣","▤","◷","▥","▤","◷","▣","⌁","↔","ϟ","☾","◐","⌖"];
const issues = issueRows.map((row, id) => {
  const [title, english, symptom, causes, solution, difficulty, time, icon, category] = row;
  const [tools, safety] = toolSets[category];
  const inspection = [...commonInspection[category]];
  const [thTools, thSafety] = toolSetsTh[category];
  const thInfo = thaiIssueInfo[id];
  const inspectionTh = [...commonInspectionTh[category]];
  if (category === "Camera Problems" && /night|IR|Black Screen/i.test(english)) inspection[1] = "Check day/night mode, ambient light, lens obstruction, and whether infrared illumination is visible in a safe, dark test area.";
  if (category === "Network Problems" && /IP Address Conflict/i.test(english)) inspection[1] = "Compare the camera's configured address against the authorized IP inventory and DHCP leases; do not scan networks you do not administer.";
  if (category === "Recording Problems" && /HDD/i.test(english)) inspection[1] = "Review storage state and recorder compatibility first. Disconnect recorder power fully before touching internal SATA or power connectors.";
  if (category === "Installation Problems" && /RJ45/i.test(english)) inspection[1] = "Use a wire-map tester at both ends and compare each conductor to the site's chosen T568A or T568B standard.";
  if (category === "Camera Problems" && /night|IR|Black Screen/i.test(english)) inspectionTh[1] = "ตรวจโหมดกลางวัน/กลางคืน แสงแวดล้อม สิ่งบังเลนส์ และไฟอินฟราเรดในพื้นที่ทดสอบที่มืดอย่างปลอดภัย";
  if (category === "Network Problems" && /IP Address Conflict/i.test(english)) inspectionTh[1] = "เทียบ IP กล้องกับทะเบียน IP และ DHCP lease ที่ได้รับอนุญาต ห้ามสแกนเครือข่ายที่ไม่ได้ดูแล";
  if (category === "Recording Problems" && /HDD/i.test(english)) inspectionTh[1] = "ตรวจสถานะที่จัดเก็บและความเข้ากันได้ก่อน ปิดและถอดปลั๊กเครื่องบันทึกก่อนแตะสาย SATA หรือสายไฟภายใน";
  if (category === "Installation Problems" && /RJ45/i.test(english)) inspectionTh[1] = "ใช้เครื่องทดสอบผังสายทั้งสองด้าน และตรวจการเรียงสีตามมาตรฐาน T568A หรือ T568B ที่เลือกใช้";
  const levelClass = difficulty.toLowerCase();
  return {
    id, title, english, symptom, causes: causes.split("; "), inspection, solution, tools, safety,
    prevention: commonPrevention[category], difficulty, levelClass, time, icon, category,
    thaiTitle:thInfo[0],thaiSymptom:thInfo[1],thaiCauses:thInfo[2].split("; "),thaiSolution:thInfo[3],
    thaiInspection:inspectionTh,thaiTools:thTools,thaiSafety:thSafety,thaiPrevention:commonPreventionTh[category]
  };
});

const categoryTabs = [{name:"All problems",short:"ALL"},...categories.map(name=>({name,short:name.replace(" Problems","").toUpperCase()}))];
let activeCategory="All problems", searchTerm="", activeDifficulty="All levels", selectedCommand=0, selectedTool=0, activeFlow="power", flowPath=[];
let toastTimer;
let commandHasRun=false;
function toast(message){
  const el=$("#support-toast");el.textContent=message;el.classList.add("visible");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("visible"),2300);
}
function copy(key){return supportCopy[language][key]??supportCopy.en[key]??key;}
function displayTitle(issue){return language==="th"?issue.thaiTitle:issue.english;}
function displayCategory(category){return supportCopy[language].categories[category]||category;}
function translatedDifficulty(level){return copy(level.toLowerCase());}
function applySupportLanguage(){
  document.documentElement.lang=language;
  document.title=language==="th"?"ศูนย์แก้ไขปัญหา CCTV — Inside the CCTV":"Troubleshooting Center — Inside the CCTV";
  document.querySelectorAll("[data-i18n]").forEach(node=>{node.innerHTML=copy(node.dataset.i18n);});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(node=>{node.placeholder=copy(node.dataset.i18nPlaceholder);});
  document.querySelectorAll("[data-i18n-aria]").forEach(node=>{node.setAttribute("aria-label",copy(node.dataset.i18nAria));});
  renderTabs();renderProblemCards();renderFlow();renderCommand();selectTool(selectedTool);renderCases();renderDifficultyButtons();renderKnowledge();
  if(openedIssueId!==null&&$("#detail-overlay").classList.contains("open"))openIssue(issues[openedIssueId]);
}
let openedIssueId=null;
function renderTabs(){
  $("#category-tabs").innerHTML=categoryTabs.map((tab,i)=>`<button class="category-tab ${activeCategory===tab.name?"active":""}" role="tab" aria-selected="${activeCategory===tab.name}" data-category="${tab.name}">${i===0?copy("allProblems"):displayCategory(tab.name)}${i===0?` · ${issues.length}`:""}</button>`).join("");
  $("#category-tabs").querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{
    activeCategory=button.dataset.category;renderTabs();renderProblemCards();
  }));
}
function renderProblemCards(){
  const filtered=issues.filter(issue=>activeCategory==="All problems"||issue.category===activeCategory);
  $("#visible-count").textContent=String(filtered.length).padStart(2,"0");
  $("#problem-grid").innerHTML=filtered.map(issue=>`<button class="problem-card" data-issue="${issue.id}">
    <span class="problem-card-top"><span class="problem-icon">${issue.icon}</span><span class="problem-severity">${translatedDifficulty(issue.difficulty)}</span></span>
    <span><strong>${displayTitle(issue)}</strong><small>${language==="th"?issue.english:issue.thaiTitle}</small></span><span class="problem-card-arrow">↗</span>
  </button>`).join("");
  $("#problem-grid").querySelectorAll("[data-issue]").forEach(card=>card.addEventListener("click",()=>openIssue(issues[Number(card.dataset.issue)])));
}
function openIssue(issue){
  openedIssueId=issue.id;
  $("#detail-number").textContent=String(issue.id+1).padStart(2,"0");
  $("#detail-category").innerHTML=`<span></span> ${displayCategory(issue.category).toUpperCase()}`;
  $("#detail-title").textContent=displayTitle(issue);
  $("#detail-symptom").textContent=`${language==="th"?issue.english:issue.thaiTitle} — ${language==="th"?issue.thaiSymptom:issue.symptom}`;
  $("#detail-level").textContent=`${translatedDifficulty(issue.difficulty).toUpperCase()} ${copy("difficulty")}`;
  $("#detail-time").textContent=`${copy("estimated")} ${issue.time.toUpperCase()}`;
  const section=(title,items,ordered=false)=>`<section class="detail-group"><h3><i></i>${title}</h3><${ordered?"ol":"ul"}>${items.map(item=>`<li>${item}</li>`).join("")}</${ordered?"ol":"ul"}></section>`;
  const localized=language==="th";
  $("#detail-content").innerHTML=
    section(copy("causes"),localized?issue.thaiCauses:issue.causes)+
    section(copy("inspection"),localized?issue.thaiInspection:issue.inspection,true)+
    section(copy("solution"),localized?[issue.thaiSolution,issue.thaiSafety]:[issue.solution,issue.safety])+
    section(copy("tools"),[localized?issue.thaiTools:issue.tools])+
    section(copy("prevention"),[localized?issue.thaiPrevention:issue.prevention]);
  const overlay=$("#detail-overlay");overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeIssue(){
  const overlay=$("#detail-overlay");overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.style.overflow="";openedIssueId=null;
}
document.querySelectorAll("[data-close-detail]").forEach(el=>el.addEventListener("click",closeIssue));
window.addEventListener("keydown",event=>{if(event.key==="Escape")closeIssue();});
renderTabs();renderProblemCards();

const flowNodes={
  power:{title:"Check camera power.",description:"Is the camera's power indicator on, or is the PoE switch showing a powered port?",step:1,yes:"connection",no:"supply"},
  connection:{title:"Check the cable connection.",description:"Are both cable ends seated and does the switch or recorder show a link light?",step:2,yes:"signal",no:"cable"},
  signal:{title:"Check the video signal.",description:"Does another known-good camera or compatible monitor show a signal on this cable?",step:3,yes:"input",no:"camera"},
  input:{title:"Check the recorder input.",description:"Is the correct NVR/DVR channel enabled and configured for this camera and format?",step:4,yes:"channel",no:"config"},
  channel:{title:"Test another channel.",description:"Does the camera display on a known-good input using a compatible cable?",step:5,yes:"faulty-input",no:"faulty-camera"},
  supply:{title:"Check adapter or PoE.",description:"Does the approved adapter or compatible PoE port show normal output/status?",step:2,yes:"cable-power",no:"power-source"},
  cable:{title:"Inspect the cable path.",description:"Does a cable tester show a complete, correctly mapped cable on every pair?",step:3,yes:"signal",no:"replace-cable"},
  "power-source":{title:"Test the power source.",description:"A qualified technician should test the isolated low-voltage supply with appropriately rated equipment.",step:3,yes:"camera-power-fault",no:"source-fault"},
  "cable-power":{title:"Check the power lead.",description:"Is the power lead secure, undamaged, and correctly rated for this camera?",step:3,yes:"power-source",no:"replace-power-lead"}
};
const flowTerminals={
  camera:{title:"Camera or signal path suspected.",description:"Test the camera on an approved known-good cable/input. If the fault follows the camera, arrange camera service or replacement.",status:"error",step:6},
  config:{title:"Recorder configuration suspected.",description:"Review channel enablement and the camera's supported video format. Save the original settings before changes.",status:"warning",step:6},
  "faulty-input":{title:"Recorder input or configuration suspected.",description:"Document the failing channel and verify it with a known-good source before service.",status:"error",step:6},
  "faulty-camera":{title:"Camera or cable path suspected.",description:"Use a short known-good cable and compatible display/input to isolate camera from cable.",status:"error",step:6},
  "replace-cable":{title:"Cable termination or run fault.",description:"Re-terminate to the site standard or replace the cable, then re-test the complete run.",status:"error",step:6},
  "camera-power-fault":{title:"Camera power input suspected.",description:"If rated power is verified at the isolated output but the camera remains off, stop and refer the device for qualified service.",status:"error",step:6},
  "source-fault":{title:"Supply or PoE port fault suspected.",description:"Remove the source from service and have a qualified technician verify or replace it with an approved component.",status:"error",step:6},
  "replace-power-lead":{title:"Power lead fault.",description:"Replace the lead with a correctly rated part and verify strain relief before restoring power.",status:"error",step:6}
};
const flowCopyTh={
  power:["ตรวจไฟเลี้ยงกล้อง","ไฟแสดงสถานะกล้องติด หรือพอร์ต PoE บนสวิตช์แสดงว่าจ่ายไฟอยู่หรือไม่"],
  connection:["ตรวจการเชื่อมต่อสาย","เสียบสายทั้งสองด้านแน่นหรือไม่ และพอร์ตสวิตช์/เครื่องบันทึกมีไฟลิงก์หรือไม่"],
  signal:["ตรวจสัญญาณวิดีโอ","กล้องหรือจอที่ทราบว่าใช้งานได้แสดงภาพผ่านสายนี้หรือไม่"],
  input:["ตรวจอินพุตเครื่องบันทึก","เปิดใช้ช่อง NVR/DVR ถูกต้อง และตั้งค่ารองรับกล้องกับรูปแบบสัญญาณนี้หรือไม่"],
  channel:["ทดสอบช่องอื่น","กล้องแสดงภาพบนช่องที่ทราบว่าใช้ได้ โดยใช้สายที่รองรับหรือไม่"],
  supply:["ตรวจอะแดปเตอร์หรือ PoE","อะแดปเตอร์ที่รับรองหรือพอร์ต PoE ที่รองรับแสดงสถานะปกติหรือไม่"],
  cable:["ตรวจแนวสาย","เครื่องทดสอบสายแจ้งว่าครบทุกคู่และเรียงขาถูกต้องหรือไม่"],
  "power-source":["ทดสอบแหล่งจ่ายไฟ","ช่างผู้มีคุณสมบัติควรทดสอบแหล่งจ่ายแรงดันต่ำที่แยกวงจรแล้วด้วยเครื่องมือพิกัดเหมาะสม"],
  "cable-power":["ตรวจสายไฟเลี้ยง","สายไฟแน่น ไม่ชำรุด และมีพิกัดตรงกับกล้องหรือไม่"],
  camera:["สงสัยกล้องหรือทางเดินสัญญาณ","ทดสอบกล้องกับสาย/อินพุตที่ทราบว่าใช้ได้ หากอาการติดตามตัวกล้องให้ส่งซ่อมหรือเปลี่ยนอุปกรณ์"],
  config:["สงสัยการตั้งค่าเครื่องบันทึก","ตรวจการเปิดช่องและรูปแบบวิดีโอที่รองรับ บันทึกค่าตั้งเดิมก่อนเปลี่ยนแปลง"],
  "faulty-input":["สงสัยอินพุตหรือการตั้งค่าเครื่องบันทึก","บันทึกช่องที่ผิดปกติและยืนยันอาการด้วยแหล่งสัญญาณที่ทราบว่าใช้ได้"],
  "faulty-camera":["สงสัยกล้องหรือสาย","ใช้สายสั้นที่ทราบว่าใช้ได้และจอ/อินพุตที่รองรับเพื่อแยกปัญหา"],
  "replace-cable":["สายหรือหัวต่อมีปัญหา","เข้าหัวใหม่ตามมาตรฐานหน้างานหรือเปลี่ยนสาย แล้วทดสอบสายตลอดเส้นอีกครั้ง"],
  "camera-power-fault":["สงสัยอินพุตไฟของกล้อง","หากตรวจพบไฟตามพิกัดที่เอาต์พุตแล้วกล้องยังไม่ทำงาน ให้หยุดและส่งช่างผู้มีคุณสมบัติตรวจ"],
  "source-fault":["สงสัยแหล่งจ่ายหรือพอร์ต PoE","หยุดใช้แหล่งจ่ายนั้นและให้ช่างผู้มีคุณสมบัติตรวจหรือเปลี่ยนเป็นอุปกรณ์ที่ผู้ผลิตรับรอง"],
  "replace-power-lead":["สายไฟเลี้ยงชำรุด","เปลี่ยนสายที่มีพิกัดถูกต้องและตรวจจุดยึดป้องกันแรงดึงก่อนจ่ายไฟ"]
};
const flowLabelsTh={power:"ไฟแสดงสถานะ",connection:"สาย / ลิงก์",signal:"สัญญาณวิดีโอ",input:"อินพุตเครื่องบันทึก",channel:"ทดสอบช่องอื่น",supply:"อะแดปเตอร์ / PoE",cable:"ทดสอบสาย"};
const flowVisited=new Set();
function renderFlow(){
  const node=flowNodes[activeFlow]||flowTerminals[activeFlow];
  const translated=language==="th"?flowCopyTh[activeFlow]:null;
  $("#flow-title").textContent=translated?.[0]||node.title;
  $("#flow-description").textContent=translated?.[1]||node.description;
  $("#flow-step-count").textContent=`${copy("diagnosticStep").toUpperCase()} ${String(node.step).padStart(2,"0")} ${copy("of")} 06`;
  $("#flow-progress-bar").style.width=`${Math.min(100,node.step/6*100)}%`;
  const terminal=!!flowTerminals[activeFlow];
  if(terminal){
    $("#flow-actions").innerHTML=`<button class="flow-action ${node.status==="error"?"no":"neutral"}" id="flow-restart">${copy("startAgain")}</button>`;
    $("#flow-actions #flow-restart").addEventListener("click",resetFlow);
  }else{
    $("#flow-actions").innerHTML=`<button class="flow-action" data-answer="yes">${copy("yes")}</button><button class="flow-action no" data-answer="no">${copy("no")}</button>`;
    $("#flow-actions").querySelectorAll("[data-answer]").forEach(button=>button.addEventListener("click",()=>{
      const answer=button.dataset.answer;
      flowVisited.add(activeFlow);activeFlow=node[answer];flowVisited.add(activeFlow);renderFlow();
    }));
  }
  const nodes=[["power","Power indicator"],["connection","Cable / link"],["signal","Video signal"],["input","Recorder input"],["channel","Test another channel"],["supply","Adapter / PoE"],["cable","Cable test"]];
  $("#flow-map").innerHTML=nodes.map(([id,label],i)=>{
    const active=id===activeFlow;
    const done=flowVisited.has(id);
    const status=activeFlow===id?"active":done?"done":"";
    const terminal=flowTerminals[activeFlow];
    return `${i?'<div class="flow-connector '+(done?"lit":"")+'"></div>':""}<div class="flow-node ${status}" ${active?`aria-current="step"`:""}><i>${active?"›":done?"✓":String(i+1).padStart(2,"0")}</i><span>${language==="th"?flowLabelsTh[id]:label}</span></div>`;
  }).join("")+ (flowTerminals[activeFlow]?`<div class="flow-connector lit"></div><div class="flow-node ${flowTerminals[activeFlow].status}"><i>!</i><span>${translated?.[0]||flowTerminals[activeFlow].title}</span></div>`:"");
}
function resetFlow(){activeFlow="power";flowVisited.clear();renderFlow();}
$("#flow-reset").addEventListener("click",resetFlow);renderFlow();

const commands=[
  {name:"ipconfig",syntax:"ipconfig",about:"Shows the active Windows network adapter configuration.",meaning:"Compare the adapter's IPv4 address and subnet with the camera's network.",error:"No active adapter or an unexpected address can indicate a disconnected link or unavailable DHCP.",output:(ip)=>`Ethernet adapter CCTV-LAB:\n   IPv4 Address. . . . . . . . . . : 192.168.1.20\n   Subnet Mask . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . : 192.168.1.1\n\nSIMULATED: Adapter and camera target ${ip} are on the same /24 subnet.`},
  {name:"ipconfig /all",syntax:"ipconfig /all",about:"Displays detailed adapter, DHCP, DNS, and physical-address information.",meaning:"Check whether DHCP is enabled, the lease is valid, and the intended interface is active.",error:"169.254.x.x is a self-assigned IPv4 address and often means DHCP was not reached.",output:(ip)=>`Ethernet adapter CCTV-LAB:\n   Description . . . . . . . . . . : Simulated Ethernet Adapter\n   Physical Address. . . . . . . . : 02-14-04-00-00-01\n   DHCP Enabled. . . . . . . . . . : Yes\n   IPv4 Address. . . . . . . . . . : 192.168.1.20 (Preferred)\n   Subnet Mask. . . . . . . . . . .: 255.255.255.0\n   Default Gateway. . . . . . . . .: 192.168.1.1\n\nSIMULATED CAMERA TARGET: ${ip}`},
  {name:"ping",syntax:"ping <IPv4 address>",about:"Sends test echo requests to check basic IP reachability.",meaning:"Replies suggest IP reachability from the source network; they do not prove video service, credentials, or recording works.",error:"Request timed out may mean routing, host firewall, camera policy, VLAN, or device availability—not necessarily a failed camera.",output:(ip)=>`Pinging ${ip} with 32 bytes of data:\nReply from ${ip}: bytes=32 time=2ms TTL=64\nReply from ${ip}: bytes=32 time=3ms TTL=64\nReply from ${ip}: bytes=32 time=2ms TTL=64\nReply from ${ip}: bytes=32 time=2ms TTL=64\n\nPing statistics for ${ip}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)\n\nSIMULATED EDUCATIONAL RESULT — not a live test.`},
  {name:"tracert",syntax:"tracert <IPv4 address>",about:"Shows the routed hops between the computer and a destination.",meaning:"Helps identify where a routed path stops responding; local same-subnet cameras usually need no routed hop.",error:"Asterisks may reflect routers that do not return traceroute responses, rather than a broken path.",output:(ip)=>`Tracing route to ${ip} over a maximum of 5 hops\n  1     1 ms     1 ms     1 ms  192.168.1.1\n  2     4 ms     4 ms     5 ms  10.20.0.1\n  3     6 ms     5 ms     6 ms  ${ip}\n\nTrace complete.\nSIMULATED ROUTE — hops are illustrative only.`},
  {name:"arp -a",syntax:"arp -a",about:"Displays recently learned IPv4-to-MAC address mappings on the local link.",meaning:"A matching local neighbor entry can help confirm layer-2 address resolution after recent communication.",error:"Missing/stale entries are inconclusive; clear/relearn only under approved network procedures.",output:(ip)=>`Interface: 192.168.1.20 --- 0x8\n  Internet Address      Physical Address      Type\n  192.168.1.1           00-14-04-00-00-01     dynamic\n  ${ip.padEnd(21)}  00-14-04-00-00-50     dynamic\n\nSIMULATED ARP TABLE — entries are fabricated for learning.`},
  {name:"nslookup",syntax:"nslookup <hostname>",about:"Queries DNS to resolve a host name to an address.",meaning:"Use it when NVR, mobile, or remote-view configuration depends on a domain name rather than a fixed IP.",error:"Non-existent domain or timeout suggests a DNS/name-resolution issue, not a camera-video fault.",output:(ip)=>`Server:  dns-lab.example\nAddress: 192.168.1.1\n\nName:    camera-lab.example\nAddress: ${ip}\n\nSIMULATED DNS RESPONSE — no DNS server was contacted.`}
];
const commandTh=[
  ["แสดงค่าการตั้งค่าอะแดปเตอร์เครือข่ายที่ใช้งานอยู่","เปรียบเทียบ IPv4 และซับเน็ตของอะแดปเตอร์กับเครือข่ายกล้อง","ไม่พบอะแดปเตอร์ที่ใช้งานหรือได้ IP ผิดปกติ อาจเกิดจากสายหลุดหรือ DHCP ไม่พร้อม"],
  ["แสดงรายละเอียดอะแดปเตอร์ DHCP, DNS และหมายเลขฮาร์ดแวร์","ตรวจว่าเปิด DHCP และได้รับ lease ถูกต้อง รวมถึงเลือกอะแดปเตอร์ที่ใช้งานจริง","IP 169.254.x.x เป็น IP ที่กำหนดเองเมื่อเครื่องมักติดต่อ DHCP ไม่ได้"],
  ["ส่งคำขอทดสอบเพื่อดูว่า IP ปลายทางเข้าถึงได้หรือไม่","การตอบกลับแสดงว่าเข้าถึง IP ได้จากเครือข่ายต้นทาง แต่ไม่ได้ยืนยันว่าบริการวิดีโอ บัญชีผู้ใช้ หรือการบันทึกทำงาน","หมดเวลารออาจเกิดจากเส้นทาง ไฟร์วอลล์ นโยบายกล้อง VLAN หรืออุปกรณ์ไม่พร้อม ไม่ได้แปลว่ากล้องเสียเสมอไป"],
  ["แสดงเราเตอร์ที่ผ่านระหว่างคอมพิวเตอร์กับปลายทาง","ช่วยระบุจุดบนเส้นทางที่ไม่ตอบกลับ โดยกล้องในซับเน็ตเดียวกันมักไม่ต้องผ่านเราเตอร์","เครื่องหมายดอกจันอาจหมายถึงเราเตอร์ไม่ตอบ traceroute ไม่จำเป็นต้องแปลว่าเส้นทางเสีย"],
  ["แสดงตารางจับคู่ IPv4 กับ MAC address ที่เรียนรู้บนเครือข่ายท้องถิ่น","รายการเพื่อนบ้านที่ตรงกันช่วยยืนยันการแปลง IP เป็น MAC หลังมีการสื่อสาร","รายการที่หายไปหรือเก่าไม่ใช่หลักฐานชี้ขาด ให้ดำเนินการล้าง/เรียนรู้ใหม่ตามขั้นตอนที่ได้รับอนุมัติ"],
  ["ค้นหา DNS เพื่อแปลงชื่อโฮสต์เป็น IP address","ใช้เมื่อ NVR มือถือ หรือการดูภาพระยะไกลกำหนดปลายทางเป็นชื่อโดเมน","ไม่พบโดเมนหรือหมดเวลามักชี้ปัญหาการแปลงชื่อ DNS ไม่ใช่ปัญหาภาพกล้อง"]
];
function renderCommand(){
  const c=commands[selectedCommand];
  $("#command-list").innerHTML=commands.map((command,i)=>`<button class="command-tab ${i===selectedCommand?"active":""}" role="tab" aria-selected="${i===selectedCommand}" data-command="${i}"><span>${command.name}</span><small>${command.syntax}</small></button>`).join("");
  $("#command-list").querySelectorAll("[data-command]").forEach(tab=>tab.addEventListener("click",()=>{selectedCommand=Number(tab.dataset.command);commandHasRun=false;renderCommand();}));
  $("#command-name").textContent=c.syntax;
  const commandTranslation=commandTh[selectedCommand];
  $("#command-about").textContent=language==="th"?commandTranslation[0]:c.about;
  $("#command-meaning").textContent=language==="th"?commandTranslation[1]:c.meaning;
  $("#command-error").textContent=language==="th"?commandTranslation[2]:c.error;
  $("#console-output").textContent=commandHasRun?c.output(readSafeIP()):`C:\\> ${c.syntax.replace("<IPv4 address>",$("#sim-ip").value||"<IPv4 address>").replace("<hostname>","camera-lab.example")}\n\n${copy("commandResult")}.`;
}
function readSafeIP(){
  const value=$("#sim-ip").value.trim();
  const parts=value.split(".");
  const valid=parts.length===4&&parts.every(part=>/^(0|[1-9]\d{0,2})$/.test(part)&&Number(part)<=255);
  if(valid)return value;
  toast(copy("validIp"));
  return "192.168.1.50";
}
$("#run-command").addEventListener("click",()=>{readSafeIP();commandHasRun=true;renderCommand();});
$("#sim-ip").addEventListener("keydown",event=>{if(event.key==="Enter")$("#run-command").click();});
renderCommand();

const tools=[
  {name:"Digital Multimeter",icon:"ϟ",category:"ELECTRICAL",purpose:"Measures compatible low-voltage electrical values to help check an approved camera supply or circuit.",steps:["Select the correct function and range before connecting probes.","With equipment isolated where required, measure only at documented, accessible low-voltage test points.","Compare the reading with the camera and supply specifications."],result:"A reading outside the specified range can indicate a supply, cable, or load issue. Never probe exposed live mains."},
  {name:"LAN Cable Tester",icon:"⌁",category:"CABLING",purpose:"Checks Ethernet conductor continuity and pin mapping across an installed cable.",steps:["Disconnect the cable from powered network equipment.","Connect the main unit and remote terminator to opposite ends.","Run the wire-map test and compare all pairs against the chosen T568A/B standard."],result:"Open, short, reversed, or split-pair indications point to a termination or cable fault; it does not certify bandwidth."},
  {name:"RJ45 Crimping Tool",icon:"⌗",category:"CABLING",purpose:"Terminates modular Ethernet plugs consistently when repairing or building patch leads.",steps:["Choose a plug matched to the cable conductor and insulation type.","Arrange conductors to the same site standard at both ends and trim evenly.","Crimp fully, then validate with a cable wire-map tester."],result:"Correct crimp pressure alone is not proof of a good link—always test the finished cable."},
  {name:"Network Cable Tester",icon:"⌁",category:"NETWORK",purpose:"A managed cable tester can evaluate wire map and, depending on model, length, PoE, or cable performance.",steps:["Confirm the tester supports the cable and PoE standard before connecting.","Isolate the cable from active equipment unless the tester specifically supports live-port testing.","Run the documented test and record any pair or length fault."],result:"Use result limits from the tester manual; a wire-map pass does not automatically certify network throughput."},
  {name:"PoE Tester",icon:"ϟ",category:"POWER / PoE",purpose:"Identifies supported PoE mode and reports power status for compatible Ethernet-powered devices.",steps:["Verify tester and camera standards are compatible.","Connect only on the intended port following the tester's instructions.","Compare detected mode and status with the camera and switch datasheets."],result:"A PoE status result helps isolate port negotiation and budget issues; it does not justify exceeding device ratings."},
  {name:"Laptop / Network Setup",icon:"▰",category:"NETWORK",purpose:"A service laptop can review authorized adapter settings and run approved, local diagnostic commands.",steps:["Connect only to a network you are authorized to administer.","Record adapter IP/subnet/gateway and the camera's approved address plan.","Use basic diagnostics and compare outputs with switch/NVR status."],result:"A laptop helps compare network configuration from a known endpoint; this guide's command lab is simulated and sends no traffic."},
  {name:"Video Test Monitor",icon:"▣",category:"VIDEO",purpose:"A compatible service monitor can help distinguish camera output, cable, and recorder-input faults.",steps:["Match the monitor input and video standard to the camera.","Use an approved known-good short cable and check the isolated camera output.","Compare the result with a known-good channel or recorder input."],result:"If local video appears but the NVR does not, focus on the cable run, channel configuration, or recorder input."}
];
const toolTh=[
  {name:"มัลติมิเตอร์ดิจิทัล",category:"ไฟฟ้า",purpose:"วัดค่าทางไฟฟ้าแรงดันต่ำที่รองรับ เพื่อช่วยตรวจแหล่งจ่ายไฟหรือวงจรกล้องที่ได้รับอนุมัติ",steps:["เลือกฟังก์ชันและช่วงวัดให้ถูกต้องก่อนต่อสายวัด","เมื่อจำเป็นให้แยกไฟก่อน วัดเฉพาะจุดทดสอบแรงดันต่ำที่ระบุและเข้าถึงได้อย่างปลอดภัย","เปรียบเทียบค่าที่อ่านได้กับข้อกำหนดของกล้องและแหล่งจ่าย"],result:"ค่าที่อยู่นอกข้อกำหนดอาจชี้ปัญหาแหล่งจ่าย สาย หรือโหลด ห้ามวัดวงจรไฟบ้านที่เปิดโล่ง"},
  {name:"เครื่องทดสอบสาย LAN",category:"สายสัญญาณ",purpose:"ตรวจความต่อเนื่องและผังขาของตัวนำอีเทอร์เน็ตตลอดแนวสาย",steps:["ถอดสายออกจากอุปกรณ์เครือข่ายที่มีไฟ","ต่อเครื่องหลักกับตัวปลายทางคนละด้านของสาย","รันทดสอบผังสายและเทียบทุกคู่ตามมาตรฐาน T568A/B ที่เลือกใช้"],result:"ผลสายขาด ลัดวงจร สลับขา หรือแยกคู่ มักชี้จุดเข้าหัวหรือสายเสีย แต่ไม่ได้รับรองแบนด์วิดท์"},
  {name:"คีมเข้าหัว RJ45",category:"สายสัญญาณ",purpose:"เข้าหัวปลั๊กอีเทอร์เน็ตให้แน่นและสม่ำเสมอเมื่อต้องซ่อมหรือทำสายแพตช์",steps:["เลือกปลั๊กให้ตรงกับชนิดตัวนำและฉนวนของสาย","เรียงสายตามมาตรฐานเดียวกันทั้งสองด้านแล้วตัดให้เสมอ","ย้ำหัวให้สุด จากนั้นตรวจด้วยเครื่องทดสอบผังสาย"],result:"การย้ำหัวแน่นไม่ได้ยืนยันว่าต่อถูกต้อง ควรทดสอบสายที่ทำเสร็จทุกครั้ง"},
  {name:"เครื่องทดสอบสายเครือข่าย",category:"เครือข่าย",purpose:"เครื่องทดสอบแบบจัดการได้อาจตรวจผังสาย ความยาว PoE หรือสมรรถนะได้ตามรุ่น",steps:["ตรวจว่ารองรับชนิดสายและมาตรฐาน PoE ก่อนใช้งาน","แยกสายออกจากอุปกรณ์ที่มีไฟ เว้นแต่คู่มือระบุว่ารองรับการทดสอบขณะต่อพอร์ต","ทดสอบตามคู่มือและบันทึกคู่สายหรือความยาวที่ผิดปกติ"],result:"เทียบผลกับเกณฑ์ของคู่มือเครื่องทดสอบ ผังสายผ่านไม่ได้แปลว่ารับรองความเร็วเครือข่าย"},
  {name:"เครื่องทดสอบ PoE",category:"ไฟเลี้ยง / PoE",purpose:"ตรวจโหมด PoE ที่รองรับและสถานะไฟเลี้ยงสำหรับอุปกรณ์อีเทอร์เน็ตที่เข้ากันได้",steps:["ตรวจว่ามาตรฐานของเครื่องทดสอบและกล้องเข้ากันได้","ต่อกับพอร์ตที่ต้องการตามวิธีในคู่มืออุปกรณ์","เทียบโหมดและสถานะที่พบกับเอกสารของกล้องและสวิตช์"],result:"ช่วยแยกปัญหาการเจรจาพอร์ตและงบไฟ แต่ห้ามใช้เกินพิกัดอุปกรณ์"},
  {name:"แล็ปท็อป / ตั้งค่าเครือข่าย",category:"เครือข่าย",purpose:"แล็ปท็อปช่างใช้ตรวจค่าการ์ดเครือข่ายและรันคำสั่งวินิจฉัยที่ได้รับอนุญาต",steps:["เชื่อมต่อเฉพาะเครือข่ายที่ได้รับอนุญาตให้ดูแล","จด IP/ซับเน็ต/เกตเวย์ของอะแดปเตอร์และแผน IP กล้องที่อนุมัติ","ใช้การวินิจฉัยพื้นฐานและเทียบผลกับสถานะสวิตช์/NVR"],result:"ช่วยเทียบค่าจากจุดเชื่อมต่อที่ทราบแน่ ห้องทดลองคำสั่งในหน้านี้เป็นเพียงการจำลอง ไม่ได้ส่งข้อมูลจริง"},
  {name:"จอทดสอบสัญญาณวิดีโอ",category:"วิดีโอ",purpose:"จอช่างที่รองรับช่วยแยกปัญหาสัญญาณกล้อง สาย และอินพุตเครื่องบันทึก",steps:["เลือกอินพุตและมาตรฐานวิดีโอให้ตรงกับกล้อง","ใช้สายสั้นที่ผู้ผลิตรับรองและตรวจเอาต์พุตกล้องที่แยกวงจรแล้ว","เปรียบเทียบผลกับช่องหรือเครื่องบันทึกที่ทราบว่าใช้งานได้"],result:"ถ้าดูภาพในพื้นที่ได้แต่ NVR ไม่ขึ้น ให้ตรวจแนวสาย การตั้งค่าช่อง หรืออินพุตเครื่องบันทึก"}
];
let toolRenderer=null,toolComposer=null,toolCamera=null,toolControls=null,toolModel=null,toolScene=null,toolAnimationId=0;
const toolButtons=$("#tool-picker");
function buildModel(type){
  const root=new THREE.Group();
  const plastic=new THREE.MeshStandardMaterial({color:type==="multimeter"?"#c44335":"#343f48",roughness:.48,metalness:.18});
  const dark=new THREE.MeshStandardMaterial({color:"#17212a",roughness:.5,metalness:.12});
  const display=new THREE.MeshStandardMaterial({color:"#a6bf9a",roughness:.25,emissive:"#526849",emissiveIntensity:.3});
  const metal=new THREE.MeshStandardMaterial({color:"#b7b7ad",roughness:.3,metalness:.72});
  const box=(size,material,pos,rotation=[0,0,0])=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.position.set(...pos);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh;};
  const cyl=(r1,r2,h,material,pos,rotation=[0,0,0])=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,24),material);mesh.position.set(...pos);mesh.rotation.set(...rotation);mesh.castShadow=true;root.add(mesh);return mesh;};
  if(type==="multimeter"){
    box([1.2,.22,1.65],plastic,[0,.15,0],[.12,0,0]);box([.78,.05,.42],display,[0,.29,-.42],[.12,0,0]);box([.35,.07,.35],dark,[0,.31,.05],[.12,0,0]);cyl(.14,.14,.12,metal,[0,.33,.06],[Math.PI/2,0,0]);
    for(let i=0;i<3;i++){cyl(.045,.045,.36,metal,[-.34+i*.34,-.03,.96],[.32,(i-1)*.06,.08]);}
    for(let i=0;i<2;i++){const pts=[new THREE.Vector3(-.25+i*.5,.02,.89),new THREE.Vector3(-.45+i*.9,-.35,1.52),new THREE.Vector3(-.58+i*1.16,-.45,1.65)];const curve=new THREE.CatmullRomCurve3(pts);root.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,.018,8,false),new THREE.MeshStandardMaterial({color:i?"#22252a":"#d34d45"})));}
  }else if(type==="cable"||type==="network"||type==="poe"){
    const color=type==="poe"?"#414d4c":"#2a343b";
    box([1.35,.22,.85],mat(color),[0,0,0]);
    for(let i=0;i<8;i++){const led=new THREE.Mesh(new THREE.SphereGeometry(.045,12,10),new THREE.MeshBasicMaterial({color:i<6?"#62c68c":"#d9b752"}));led.position.set(-.48+i*.137,.14,.34);root.add(led);}
    for(let i=0;i<8;i++)box([.07,.08,.08],metal,[-.49+i*.14,.12,-.36]);
    const cableMat=new THREE.MeshStandardMaterial({color:"#89988f",roughness:.8});
    for(let s of [-1,1]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(s*.6,0,-.3),new THREE.Vector3(s*.9,.05,-.3),new THREE.Vector3(s*1.1,.08,-.05)]);root.add(new THREE.Mesh(new THREE.TubeGeometry(curve,20,.04,8,false),cableMat));}
    if(type==="poe")box([.48,.1,.3],plastic,[0,.17,-.02]);
  }else if(type==="crimper"){
    box([.55,.13,.35],metal,[0,.1,0]);box([.18,.13,.7],metal,[0,.1,0]);box([.13,.09,1.1],plastic,[-.17,-.3,.15],[.06,0,-.35]);box([.13,.09,1.1],plastic,[.17,-.3,.15],[-.06,0,.35]);cyl(.08,.08,.2,dark,[0,.18,0],[Math.PI/2,0,0]);
  }else if(type==="laptop"){
    box([1.5,.1,1],metal,[0,-.15,.42]);box([1.5,.9,.09],dark,[0,.3,-.08],[.16,0,0]);box([1.32,.72,.025],display,[0,.31,-.02],[.16,0,0]);box([1.2,.018,.58],dark,[0,-.09,.42]);
    for(let i=0;i<5;i++)box([.72,.012,.02],metal,[0,-.075,.18+i*.06]);
  }else if(type==="monitor"){
    box([1.55,1,.12],dark,[0,.35,0]);box([1.38,.83,.03],display,[0,.36,.075]);box([.16,.38,.16],metal,[0,-.36,-.02]);box([.7,.1,.45],dark,[0,-.55,0]);
  }
  const fill=new THREE.Mesh(new THREE.PlaneGeometry(5,5),new THREE.ShadowMaterial({opacity:.2}));
  fill.rotation.x=-Math.PI/2;fill.position.y=-.58;fill.receiveShadow=true;root.add(fill);
  return root;
  function mat(color){return new THREE.MeshStandardMaterial({color,roughness:.5,metalness:.16});}
}
function initToolScene(){
  const canvasRoot=$("#tool-canvas");
  try{
    toolScene=new THREE.Scene();toolScene.background=new THREE.Color("#1a2935");
    toolCamera=new THREE.PerspectiveCamera(36,1,.1,30);toolCamera.position.set(3.2,2.4,4.2);
    toolRenderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"low-power"});
    toolRenderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));toolRenderer.outputColorSpace=THREE.SRGBColorSpace;toolRenderer.toneMapping=THREE.ACESFilmicToneMapping;toolRenderer.toneMappingExposure=1.2;
    toolRenderer.shadowMap.enabled=true;toolRenderer.shadowMap.type=THREE.PCFShadowMap;canvasRoot.appendChild(toolRenderer.domElement);
    toolScene.add(new THREE.HemisphereLight("#e1e6dc","#20262b",2));
    const key=new THREE.DirectionalLight("#f4d293",3);key.position.set(-3,6,4);key.castShadow=true;key.shadow.mapSize.set(512,512);toolScene.add(key);
    const fill=new THREE.DirectionalLight("#a4c4d2",1.3);fill.position.set(4,3,-4);toolScene.add(fill);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshStandardMaterial({color:"#23323e",roughness:.72}));floor.rotation.x=-Math.PI/2;floor.position.y=-.63;floor.receiveShadow=true;toolScene.add(floor);
    toolControls=new OrbitControls(toolCamera,toolRenderer.domElement);toolControls.enableDamping=true;toolControls.dampingFactor=.08;toolControls.minDistance=2.7;toolControls.maxDistance=8;toolControls.target.set(0,0,0);
    selectTool(0);resizeTool();
    const animate=()=>{toolAnimationId=requestAnimationFrame(animate);toolControls.update();if(toolModel)toolModel.rotation.y+=.0018;toolRenderer.render(toolScene,toolCamera);};
    animate();
  }catch(error){
    console.warn("3D tool illustration is unavailable; the written tool instructions remain available.",error);
    canvasRoot.innerHTML=`<div class="tool-fallback">${copy("toolFallback")}</div>`;
  }
}
function selectTool(index){
  selectedTool=index;const tool=tools[index];
  const translatedTool=language==="th"?toolTh[index]:null;
  toolButtons.innerHTML=tools.map((item,i)=>`<button class="tool-pick ${i===index?"active":""}" data-tool="${i}"><span>${item.icon}</span>${language==="th"?toolTh[i].name:item.name}</button>`).join("");
  toolButtons.querySelectorAll("[data-tool]").forEach(button=>button.addEventListener("click",()=>selectTool(Number(button.dataset.tool))));
  const localized=translatedTool||tool;
  $("#tool-index").textContent=String(index+1).padStart(2,"0");$("#tool-caption-name").textContent=localized.name.toUpperCase();
  $("#tool-category").textContent=localized.category;$("#tool-name").textContent=localized.name;$("#tool-purpose").textContent=localized.purpose;
  $("#tool-steps").innerHTML=localized.steps.map(step=>`<li>${step}</li>`).join("");$("#tool-result").textContent=localized.result;
  if(toolScene){
    if(toolModel){toolScene.remove(toolModel);toolModel.traverse(obj=>{if(obj.geometry)obj.geometry.dispose();});}
    const type=["multimeter","cable","crimper","network","poe","laptop","monitor"][index];
    toolModel=buildModel(type);toolScene.add(toolModel);
  }
}
function resizeTool(){
  if(!toolRenderer||!toolCamera)return;
  const rect=$("#tool-canvas").getBoundingClientRect();if(!rect.width||!rect.height)return;
  toolCamera.aspect=rect.width/rect.height;toolCamera.updateProjectionMatrix();toolRenderer.setSize(rect.width,rect.height,false);
}
window.addEventListener("resize",resizeTool);
initToolScene();

const cases=[
  {title:"CCTV Camera Offline",symptoms:"Camera appears offline in the NVR.",causes:"Network cable, IP configuration, power, or network connection.",solution:"Check link status and PoE/power first; compare IP configuration with the approved plan; test reachability from the correct network; verify NVR connection details."},
  {title:"Camera Has Power but No Image",symptoms:"Indicator is on, but no video appears.",causes:"Signal connection, incorrect configuration, incompatible video format, or faulty camera.",solution:"Reseat the signal connection, confirm the channel and supported video settings, then test on another known-good channel and cable."},
  {title:"Night Vision Not Working",symptoms:"Camera works during the day but produces dark images at night.",causes:"IR LEDs, light sensor, power supply, or IR-cut filter.",solution:"Check night-mode configuration and IR illumination; inspect for obstruction/reflection; verify the supply is rated for night-mode load."},
  {title:"NVR Cannot Detect HDD",symptoms:"Recording device cannot recognize the hard drive.",causes:"SATA connection, power connection, unsupported HDD, or HDD failure.",solution:"Power down and unplug first; check connections and device compatibility; use supported storage status/diagnostics or qualified service."},
  {title:"Remote Viewing Not Working",symptoms:"CCTV works locally but cannot be viewed on a mobile phone.",causes:"Internet connection, router configuration, DNS, application settings, or cloud/P2P service.",solution:"Confirm site internet and recorder network status; review account/app and authorized remote access settings; check DNS/cloud service state."}
];
const casesTh=[
  {title:"กล้อง CCTV ออฟไลน์",symptoms:"กล้องแสดงสถานะออฟไลน์ใน NVR",causes:"สายเครือข่าย การกำหนด IP ไฟเลี้ยง หรือการเชื่อมต่อเครือข่าย",solution:"ตรวจลิงก์และไฟ/PoE ก่อน เทียบ IP กับแผนที่อนุมัติ ทดสอบจากเครือข่ายที่ถูกต้อง และตรวจค่าการเชื่อมต่อ NVR"},
  {title:"กล้องมีไฟแต่ไม่มีภาพ",symptoms:"ไฟแสดงสถานะติด แต่ไม่มีภาพวิดีโอ",causes:"การเชื่อมต่อสัญญาณ การตั้งค่า รูปแบบวิดีโอไม่รองรับ หรือกล้องเสีย",solution:"เสียบสายสัญญาณใหม่ ตรวจช่องและรูปแบบวิดีโอที่รองรับ จากนั้นทดสอบช่องและสายที่ทราบว่าใช้ได้"},
  {title:"ระบบกลางคืนไม่ทำงาน",symptoms:"กลางวันใช้งานได้ แต่กลางคืนภาพมืด",causes:"หลอด IR เซนเซอร์วัดแสง แหล่งจ่ายไฟ หรือฟิลเตอร์ IR-Cut",solution:"ตรวจค่าโหมดกลางคืนและไฟอินฟราเรด ตรวจสิ่งบัง/แสงสะท้อน และยืนยันว่าแหล่งจ่ายรองรับโหลดกลางคืน"},
  {title:"NVR ตรวจไม่พบ HDD",symptoms:"เครื่องบันทึกไม่รู้จักฮาร์ดดิสก์",causes:"สาย SATA สายไฟ ดิสก์ไม่รองรับ หรือดิสก์เสีย",solution:"ปิดและถอดปลั๊กก่อน ตรวจสายและความเข้ากันได้ แล้วใช้สถานะ/เครื่องมือตรวจที่รองรับหรือส่งช่างผู้มีคุณสมบัติ"},
  {title:"ดูภาพจากระยะไกลไม่ได้",symptoms:"ดู CCTV ในพื้นที่ได้ แต่ดูผ่านโทรศัพท์มือถือไม่ได้",causes:"อินเทอร์เน็ต เราเตอร์ DNS การตั้งค่าแอป หรือบริการคลาวด์/P2P",solution:"ยืนยันอินเทอร์เน็ตและสถานะเครือข่ายของเครื่องบันทึก ตรวจบัญชี/แอปและค่าการเข้าถึงระยะไกลที่ได้รับอนุญาต รวมถึงสถานะ DNS/คลาวด์"}
];
function renderCases(){
  const list=language==="th"?casesTh:cases;
  $("#case-grid").innerHTML=list.map((item,i)=>`<article class="case-card"><button class="case-toggle" aria-expanded="false"><span class="case-number">${copy("caseLabel")} / 0${i+1}</span><strong>${item.title}</strong><small>${item.symptoms}</small><span>+</span></button><div class="case-detail"><b>${copy("likelyCauses")}</b><p>${item.causes}</p><b>${copy("firstResponse")}</b><p>${item.solution}</p></div></article>`).join("");
  $("#case-grid").querySelectorAll(".case-toggle").forEach(button=>button.addEventListener("click",()=>{
    const card=button.closest(".case-card");const open=card.classList.toggle("open");button.setAttribute("aria-expanded",String(open));
  }));
}

function renderDifficultyButtons(){
  const levels=["All levels","Beginner","Intermediate","Advanced"];
  const levelKeys={"All levels":"allLevels","Beginner":"beginner","Intermediate":"intermediate","Advanced":"advanced"};
  $("#difficulty-filters").innerHTML=levels.map(level=>`<button class="difficulty-button ${activeDifficulty===level?"active":""}" data-level="${level}">${copy(levelKeys[level])}</button>`).join("");
  $("#difficulty-filters").querySelectorAll("[data-level]").forEach(button=>button.addEventListener("click",()=>{activeDifficulty=button.dataset.level;renderDifficultyButtons();renderKnowledge();}));
}
function renderKnowledge(){
  const q=searchTerm.toLowerCase();
  const matches=issues.filter(issue=>{
    const matchLevel=activeDifficulty==="All levels"||issue.difficulty===activeDifficulty;
    const text=[issue.title,issue.english,issue.symptom,issue.category,...issue.causes,issue.solution,issue.thaiTitle,issue.thaiSymptom,...issue.thaiCauses,issue.thaiSolution].join(" ").toLowerCase();
    return matchLevel&&text.includes(q);
  });
  $("#knowledge-list").innerHTML=matches.map(issue=>`<button class="knowledge-row" data-issue="${issue.id}"><span class="knowledge-name">${displayTitle(issue)} <small>· ${language==="th"?issue.english:issue.thaiTitle}</small></span><span class="knowledge-symptom">${language==="th"?issue.thaiSymptom:issue.symptom}</span><span class="knowledge-level ${issue.levelClass}">${translatedDifficulty(issue.difficulty)}</span><span class="knowledge-time">${issue.time}</span><span class="knowledge-open">↗</span></button>`).join("");
  $("#empty-state").classList.toggle("hidden",matches.length>0);
  $("#knowledge-list").querySelectorAll("[data-issue]").forEach(row=>row.addEventListener("click",()=>openIssue(issues[Number(row.dataset.issue)])));
}
$("#knowledge-search").addEventListener("input",event=>{searchTerm=event.target.value;renderKnowledge();});
const languageSelect=$("#language-select");
languageSelect.value=language;
languageSelect.addEventListener("change",()=>{
  language=languageSelect.value;
  localStorage.setItem("cctv-language",language);
  applySupportLanguage();
});
applySupportLanguage();
