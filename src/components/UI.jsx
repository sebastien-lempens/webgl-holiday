import { Html } from "@react-three/drei";
export const UI = ({ weather, handleWeather }) => {
  return (
    <Html transform distanceFactor={0.8} style={{ maxWidth: "100px", color: "white", transform: "translatex(-350px)" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "15px", listStyleType: "none", margin: 0, padding: 0 }}>
        <li
          onClick={() => handleWeather("sunny")}
          style={{ cursor: "pointer", filter: `${weather === "sunny" ? "drop-shadow(0 0 5px white) drop-shadow(0 0 5px white)" : "none"}` }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 96 960 960' width='48' fill='rgba(255,255,255,0.5)'>
            <path d='M450 286V136h60v150h-60Zm256 106-42-42 106-107 42 43-106 106Zm64 214v-60h150v60H770Zm-320 410V866h60v150h-60ZM253 391 148 286l42-42 106 106-43 41Zm518 517L664 802l41-41 108 104-42 43ZM40 606v-60h150v60H40Zm151 302-43-42 105-105 22 20 22 21-106 106Zm289-92q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-60q75 0 127.5-52.5T660 576q0-75-52.5-127.5T480 396q-75 0-127.5 52.5T300 576q0 75 52.5 127.5T480 756Zm0-180Z' />
          </svg>
        </li>
        <li
          onClick={() => handleWeather("sunset")}
          style={{
            cursor: "pointer",
            filter: `${weather === "sunset" ? "drop-shadow(0 0 5px white) drop-shadow(0 0 5px white)" : "none"}`,
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 96 960 960' width='48' fill='rgba(255,255,255,0.5)'>
            <path d='M480.266 976q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Zm-.225 260Q509 836 537 830t53-18q-67-32-108.5-95T440 575.5q0-78.5 41.5-141.5T590 340q-25-12-53-18t-57.225-6q-108.239 0-184.007 75.292Q220 466.583 220 576q0 108.333 75.768 184.167Q371.536 836 479.775 836Z' />
          </svg>
        </li>
        <li
          onClick={() => handleWeather("night")}
          style={{ cursor: "pointer", filter: `${weather === "night" ? "drop-shadow(0 0 5px white) drop-shadow(0 0 5px white)" : "none"}` }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 96 960 960' width='48' fill='rgba(255,255,255,0.5)'>
            <path d='M593 976q-88.114 0-166.557-32.5Q348 911 288.43 855.592q-59.57-55.409-94-129.625Q160 651.75 160 568.383 160 484 194.5 409.5q34.5-74.5 94-130t137.943-88Q504.886 159 593 159q47 0 88 10t79 27q-90 64-146 160t-56 211.5q0 115.5 56 212T760 939q-38 17-79 27t-88 10Zm0-60h26.419Q632 916 640 915q-66-74-104-162t-38-185q0-97 38-185t104-163q-8-1-20.581-1H593q-153 0-263 101.962-110 101.963-110 247Q220 713 330 814.5T593 916Zm-95-349Z' />
          </svg>
        </li>
        <li
          onClick={() => handleWeather("rainy")}
          style={{ cursor: "pointer", filter: `${weather === "rainy" ? "drop-shadow(0 0 5px white) drop-shadow(0 0 5px white)" : "none"}` }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' height='48' viewBox='0 96 960 960' width='48' fill='rgba(255,255,255,0.5)'>
            <path d='M558 973q-11 5-23.5 1T517 959l-69-138q-5-11-1.5-23.5T461 780q11-5 23.5-1t17.5 15l69 138q5 11 1.5 23.5T558 973Zm240-1q-11 5-23.5 1T757 958l-69-138q-5-11-1.5-23.5T701 779q11-5 23.5-1t17.5 15l69 138q5 11 1.5 23.5T798 972Zm-480 0q-11 5-23.5 1.5T277 959l-69-138q-5-11-1-23.5t15-17.5q11-5 23.5-1.5T263 793l69 139q5 11 1 23t-15 17Zm-28-256q-87 0-148.5-61.5T80 506q0-79 56.5-141T277 297q32-56 84.5-88.5T480 176q91 0 152.5 57.5T708 376q79 4 125.5 53.5T880 546q0 70-49.5 120T710 716H290Zm0-60h420q46 0 78-32.5t32-77.5q0-46-32-78t-78-32h-60v-30q0-71-49.5-120.5T480 236q-51 0-93.5 27.5T324 338l-8 18h-28q-62 2-105 45.5T140 506q0 62 44 106t106 44Zm190-210Z' />
          </svg>
        </li>
      </ul>
    </Html>
  );
};
