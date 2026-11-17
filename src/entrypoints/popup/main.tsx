import { createRoot } from "react-dom/client";

import IndexPopup from "~/popup";

const root = document.getElementById("root");
if (!root) throw new Error("Popup root element is missing.");

createRoot(root).render(<IndexPopup />);
