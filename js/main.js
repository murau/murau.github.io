let maskName = Inputmask({
  clearIncomplete: true,
  clearMaskOnLostFocus: true,
  regex: "[A-Za-z \u00C0-\u017F.-]*",
  showMaskOnFocus: false,
  showMaskOnHover: false,
});
let maskEmail = Inputmask({
  mask:
    "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",
  greedy: false,
  casing: "lower",
  onBeforePaste: function (pastedValue, opts) {
    pastedValue = pastedValue.toLowerCase();
    return pastedValue.replace("mailto:", "");
  },
  definitions: {
    "*": {
      validator:
        "[0-9\uFF11-\uFF19A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5!#$%&'*+/=?^_`{|}~-]",
    },
    "-": {
      validator: "[0-9A-Za-z-]",
    },
  },
  clearIncomplete: true,
  clearMaskOnLostFocus: true,
  showMaskOnFocus: false,
  showMaskOnHover: false,
});
maskName.mask(document.querySelectorAll("[name=nome]"));
maskEmail.mask(document.querySelectorAll("[name=email]"));
function alert(alertMessage, type = "warning") {
  toastr.options = {
    closeButton: true,
    debug: false,
    extendedTimeOut: "1000",
    hideDuration: "1000",
    hideEasing: "linear",
    hideMethod: "fadeOut",
    newestOnTop: true,
    onclick: null,
    positionClass: "toast-bottom-center",
    preventDuplicates: true,
    progressBar: true,
    showDuration: "300",
    showEasing: "swing",
    showMethod: "fadeIn",
    timeOut: "5000",
  };
  toastr[type](alertMessage);
}
const murau = {
  updateMiniCart: (qtd) => {
    let cartqtd = document.querySelectorAll(".cartQtd");
    for (cartQtd of cartqtd) {
      cartQtd.textContent = qtd;
    }
    let portalmc = document.querySelector(".portal-minicart-ref");
    let dropcart = document.querySelector(".vtexsc-cart");
    let newdropcart = document.createElement("div");
    newdropcart.setAttribute("id", "dropcart");
    newdropcart.classList.add("col-12");
    if (qtd === 0) {
      newdropcart.innerHTML =
        "<div class='d-flex justify-content-center align-items-center h-100'><h4 class='titleDropCart'>Sua sacola está vazia.</h4></div>";
    } else {
      let titleDropCart = document.createElement("h4");
      titleDropCart.classList.add(
        "titleDropCart",
        "pb-3",
        "mb-3",
        "border-bottom"
      );
      titleDropCart.innerHTML = `<span class='badge badge-pill badge-secondary cartQtd'>${qtd}</span> Ite${
        qtd > 1 ? "ns" : "m"
      } na sacola <i class="fa-fw fas fa-shopping-bag"></i>`;
      if (dropcart) newdropcart.innerHTML = dropcart.cloneNode(true).innerHTML;
      newdropcart.insertBefore(titleDropCart, newdropcart.firstChild);
    }
    portalmc.insertBefore(newdropcart, portalmc.firstChild);
    portalmc.classList.add("row", "h-100");
    let cartcheckout = document.querySelector(".cartCheckout");
    cartcheckout.setAttribute("href", "/checkout/#/cart");
    cartcheckout.textContent = "Finalizar compra";
    cartcheckout.classList.add(
      "mt-5",
      "btn",
      "btn-primary",
      "btn-block",
      "text-light",
      "text-uppercase",
      "font-weight-light"
    );
    dropcart.parentNode.removeChild(dropcart);
  },
  tipTitle: () => {
    tippy("a[title]", {
      content: (el) => el.getAttribute("title"),
    });
    let hasTitle = document.querySelectorAll("[title]");
    for (i = 0; i < hasTitle.length; i++) {
      hasTitle[i].removeAttribute("title");
    }
  },
  areYouMobile: () => {
    let body = document.querySelector("body");
    let home = body.querySelector(".home");
    let header = body.querySelector("header");
    let toggler = header.querySelector(".navbar-toggler");
    if (toggler.offsetParent) {
      body.classList.add("mobile");
      header.classList.add("mobile");
      header.classList.remove("fixed-top");
      if (!home) body.style.marginTop = 0;
    } else {
      body.classList.remove("mobile");
      header.classList.remove("mobile");
      header.classList.add("fixed-top");
      if (!home) body.style.marginTop = `${header.offsetHeight}px`;
    }
  },
  userColorScheme: () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    )
      return "light";
  },
};
vtexjs.checkout.getOrderForm().done((orderForm) => {
  murau.updateMiniCart(orderForm.items.length);
});
window.addEventListener("resize", () => murau.areYouMobile());
window.addEventListener("scroll", () => {
  let bodyHeader = document.querySelectorAll("body, header");
  if (window.pageYOffset > 100) {
    for (i = 0; i < bodyHeader.length; i++) {
      bodyHeader[i].classList.add("scroll");
    }
  } else {
    for (i = 0; i < bodyHeader.length; i++) {
      bodyHeader[i].classList.remove("scroll");
    }
    murau.areYouMobile();
  }
});
window.addEventListener("click", (e) => {
  let target = e.target;
  if (
    target.className &&
    target.parentNode.className.includes("cartSkuRemove")
  ) {
    e.preventDefault();
    let index = target.parentNode.getAttribute("data-index");
    vtexjs.checkout.getOrderForm().then((orderForm) => {
      let item = orderForm.items[index];
      let quantity = item.quantity;
      vtexjs.checkout
        .removeItems([
          {
            index: index,
            quantity: quantity,
          },
        ])
        .done((orderForm) => {
          murau.updateMiniCart(orderForm.items.length);
          console.log(`Item (${item.name}) removido da sacola com sucesso!`);
        });
    });
    return;
  }
  if (
    target.className &&
    target.className.includes("buy-button") &&
    target.getAttribute("href").includes("cart/add")
  ) {
    e.preventDefault();
    let sku = target
      .getAttribute("href")
      .split("sku=")
      .pop()
      .split("&qty=")
      .shift();
    vtexjs.checkout
      .addToCart([{ id: sku, quantity: 1, seller: 1 }])
      .done((orderForm) => {
        murau.updateMiniCart(orderForm.items.length);
        new Modal(document.querySelector("#murau-mini-cart")).show();
      });
    return;
  }
  if (target.className && target.className.includes("cNewsletter")) {
    e.preventDefault();
    let nome = target.parentNode.querySelector("[name=nome]").value.trim();
    if (!nome) return alert("Preencha o campo nome.");
    let email = target.parentNode.querySelector("[name=email]").value;
    if (!email) return alert("Preencha o campo e-mail.");
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) return alert("Digite um e-mail válido.");
    let disabled = (value = true) => (target.disabled = value);
    disabled(true);
    fetch(`/api/dataentities/NL/search?email=${email}&_fields=email`)
      .then((response) => response.json())
      .then((emailChk) => {
        if (emailChk && emailChk.length) {
          alert("O e-mail informado já foi cadastrado.", "info");
          localStorage.setItem("userRegistered", true);
          return disabled(false);
        }
        fetch("/api/dataentities/NL/documents", {
          method: "POST",
          body: JSON.stringify({ nome: nome, email: email }),
          headers: {
            Accept: "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            alert("Cadastro realizado com sucesso.", "success");
            localStorage.setItem("userRegistered", true);
            return disabled(false);
          })
          .catch((err) => {
            console.log(err);
            alert(
              "Ocorreu um erro ao registrar seu e-mail. Tente novamente mais tarde.",
              "error"
            );
          });
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Ocorreu um erro ao registrar seu e-mail. Tente novamente mais tarde.",
          "error"
        );
      });
    return disabled(false);
  }
});
let zoomImages = document.querySelectorAll("#show ul.thumbs li a");
if (zoomImages && zoomImages.length) {
  let productCarouselImages = `
<div id="productImages" class="carousel slide mb-4" data-ride="carousel">
    <ol class="carousel-indicators">
`;
  for (i = 0; i < zoomImages.length; i++) {
    productCarouselImages += `
        <li data-target="#productImages" data-slide-to="${i}"${
      i === 0 ? '  class="active"' : ""
    }></li>
    `;
  }
  productCarouselImages += `
    </ol>
<div class="carousel-inner">
`;
  for (i = 0; i < zoomImages.length; i++) {
    let img = zoomImages[i].getAttribute("zoom");
    let thumb = zoomImages[i].getAttribute("rel");
    productCarouselImages += `
        <div class="carousel-item${i === 0 ? " active" : ""}">
            <a href="${img}" class="d-block">
                <img src="${thumb}" class="img-fluid img-thumbnail" alt="${
      document.title
    }" title="${document.title}" />
            </a>
        </div>
    `;
  }
  productCarouselImages += `
</div>
<a class="carousel-control-prev" href="#productImages" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Anterior</span>
</a>
<a class="carousel-control-next" href="#productImages" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Próxima</span>
</a>
</div>
`;
  document.querySelector(".apresentacao").innerHTML = productCarouselImages;
  document.addEventListener("DOMContentLoaded", () => {
    new Carousel(document.querySelector("#productImages"), {
      interval: false,
      pause: false,
      keyboard: true,
    });
    new SimpleLightbox({
      elements: document.querySelectorAll("#productImages .carousel-item a"),
    });
  });
}
murau.tipTitle();
document.addEventListener("readystatechange", () => {
  murau.tipTitle();
});
document
  .querySelector("#searchBox")
  .addEventListener("hidden.bs.collapse", () => murau.areYouMobile());
murau.areYouMobile();
const smooth = new SmoothScroll('a[href*="#"]');
const modals = document.querySelectorAll("[data-toggle=modal]");
for (i = 0; i < modals.length; i++) {
  modals[i].addEventListener("click", (evt) => {
    evt.preventDefault();
    let target = document.querySelector(evt.target.getAttribute("data-target"));
    if (target) new Modal(target).show();
  });
}
const tabPills = document.querySelectorAll("[data-toggle=pill]");
for (var i = 0; i < tabPills.length; i++) {
  new Tab(tabPills[i]);
}
/* tabPills[0].Tab.show(); */
