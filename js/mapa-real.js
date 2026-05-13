let map;
let userMarker;
let trafficLayer;
let socket;
let realBusMarkers = {};

function initMap() {
  const saoPaulo = {
    lat: -23.55052,
    lng: -46.633308
  };

  map = new google.maps.Map(document.getElementById("map"), {
    center: saoPaulo,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  trafficLayer = new google.maps.TrafficLayer();

  pegarLocalizacao();

  iniciarWebSocketOnibus();
}

function pegarLocalizacao() {
  if (!navigator.geolocation) {
    alert("Seu navegador não suporta GPS.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const local = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      userMarker = new google.maps.Marker({
        position: local,
        map: map,
        title: "Você está aqui",
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });

      map.setCenter(local);
      map.setZoom(15);
    },
    function () {
      alert("Não foi possível pegar sua localização.");
    }
  );
}

function centralizarUsuario() {
  if (!userMarker) {
    pegarLocalizacao();
    return;
  }

  map.setCenter(userMarker.getPosition());
  map.setZoom(15);
}

function toggleTransito() {
  if (trafficLayer.getMap()) {
    trafficLayer.setMap(null);
  } else {
    trafficLayer.setMap(map);
  }
}

function iniciarWebSocketOnibus() {
  socket = io("http://localhost:3000");

  socket.on("connect", function () {
    console.log("Conectado ao backend:", socket.id);
  });

  socket.on("bus:update", function (buses) {
    console.log("Ônibus reais recebidos:", buses);

    buses.forEach(function (bus) {
      atualizarOnibusTempoReal(bus);
    });
  });
}

function atualizarOnibusTempoReal(bus) {
  const position = {
    lat: bus.lat,
    lng: bus.lng
  };

  if (!realBusMarkers[bus.id]) {
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: `Linha ${bus.linha} | Ônibus ${bus.prefixo}`,
      icon: {
        url: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
        scaledSize: new google.maps.Size(34, 34)
      }
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="color:black; font-family:Arial;">
          <strong>Linha ${bus.linha}</strong><br>
          Prefixo: ${bus.prefixo}
        </div>
      `
    });

    marker.addListener("click", function () {
      info.open(map, marker);
    });

    realBusMarkers[bus.id] = marker;
  } else {
    realBusMarkers[bus.id].setPosition(position);
  }
}