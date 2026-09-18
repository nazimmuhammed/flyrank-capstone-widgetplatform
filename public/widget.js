(function () {
  const script = document.currentScript;
  const params = new URLSearchParams(script.src.split("?")[1] || "");
  const widgetId = params.get("id");

  if (!widgetId) {
    console.error("FlyRank widget ID missing");
    return;
  }

  const apiBase = new URL(script.src).origin;

  fetch(`${apiBase}/widgets/${widgetId}/config`)
    .then(response => response.json())
    .then(config => {
      const container = document.createElement("div");

      container.style.cssText =
        "position:fixed;bottom:20px;right:20px;background:white;" +
        "padding:20px;border:1px solid #ddd;border-radius:10px;" +
        "box-shadow:0 4px 20px rgba(0,0,0,.15);z-index:99999;" +
        "font-family:Arial;max-width:320px;";

      const title = document.createElement("h3");
      title.textContent = config.title;

      const description = document.createElement("p");
      description.textContent = config.description || "";

      const form = document.createElement("form");

      config.form_fields.forEach(field => {
        const input = document.createElement(
          field.type === "textarea" ? "textarea" : "input"
        );

        input.name = field.name;
        input.placeholder = field.label;
        input.required = !!field.required;

        input.style.cssText =
          "display:block;width:100%;box-sizing:border-box;" +
          "margin:8px 0;padding:8px;";

        form.appendChild(input);
      });

      // Honeypot
      const honeypot = document.createElement("input");
      honeypot.name = "website";
      honeypot.style.display = "none";
      form.appendChild(honeypot);

      const button = document.createElement("button");
      button.type = "submit";
      button.textContent = config.button_text || "Submit";

      form.appendChild(button);

      form.addEventListener("submit", async event => {
        event.preventDefault();

        const data = {};

        new FormData(form).forEach((value, key) => {
          if (key !== "website") data[key] = value;
        });

        const response = await fetch(
          `${apiBase}/submissions/${widgetId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              data,
              website: honeypot.value
            })
          }
        );

        if (response.ok) {
          form.innerHTML = "<p>Thank you! Your submission was received.</p>";
        } else {
          alert("Submission failed. Please try again.");
        }
      });

      container.appendChild(title);
      container.appendChild(description);
      container.appendChild(form);

      document.body.appendChild(container);
    })
    .catch(error => {
      console.error("FlyRank widget failed:", error);
    });
})();