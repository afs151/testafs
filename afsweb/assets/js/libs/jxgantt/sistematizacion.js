var demo_tasks = {
    "data": [
        {
            "id": 1,
            "text": "Implementar proceso para captura de informacion iniciando por sistema de trafico (SLAM) hacia su transferencia a pedimento (Aduanet) dependiendo del tipo de operacion",
            "start_date": "01-09-2015",
            "duration": "30",
            "progress": 20,
            "open": true
        },
        {
            "id": 2,
            "text": "Depuracion de sistemas para asegurar el flujo completo de la informacion",
            "start_date": "07-09-2015",
            "duration": "10",
            "progress": 8,
            "open": true
        },
        {
            "id": 3,
            "text": "Depuracion de modulo de portafolios en trafico para minimizar errores de captura",
            "start_date": "11-09-2015",
            "duration": "18",
            "progress": 10,
            "open": true
        },
        {
            "id": 4,
            "text": "Realizar ajustes en sistema de trafico para el control de consecutivo de referencia/pedimentos/sellos",
            "start_date": "01-09-2015",
            "duration": "30",
            "progress": 0.4,
            "open": true
        },
        {
            "id": 5,
            "text": "Capacitar al personal de sistemas en el uso de los sistemas, tanto tecnica como operativa, actualmente ya cuentan con el conocimiento de los modulos basicos del sistema, faltaría revisar",
            "start_date": "08-09-2015",
            "duration": "4",
            "progress": 4,
            "open": true
        },
        {
            "id": 6,
            "text": "Capacitar al personal de aduana Leon Gto., en los diferentes modulos, teniendo una base comun y despues especializar por tipo de embarque, segun las metricas definidas por area",
            "start_date": "21-09-2015",
            "duration": "2",
            "progress": 0.4,
            "open": true
        },
        {
            "id": 7,
            "text": "Capacitar en cambios al personal de aduana Laredo Tx",
            "start_date": "28-09-2015",
            "duration": "5",
            "progress": 0.4,
            "open": true
        },
        {
            "id": 8,
            "text": "Capacitar al personal de aduana Nuevo Laredo",
            "start_date": "03-09-2015",
            "duration": "2",
            "progress": 2,
            "open": true
        },
        {
            "id": 9,
            "text": "Capacitar al personal de aduana Piedras Negras",
            "start_date": "28-09-2015",
            "duration": "1",
            "progress": 0.4,
            "open": true
        },
        {
            "id": 10,
            "text": "Ajustes e Implementacion de Dasboard al 100% segun las metricas de cada area",
            "start_date": "21-09-2015",
            "duration": "15",
            "progress": 0.4,
            "open": true
        },
        {
            "id": 11,
            "text": "Eliminar uso de otras herramientas",
            "start_date": "14-09-2015",
            "duration": "1",
            "progress": 0.4,
            "open": true
        },
        {
            "id": 12,
            "text": "Consolidaciones",
            "start_date": "08-09-2015",
            "duration": "2",
            "parent": "5",
            "progress": 2
        },
        {
            "id": 13,
            "text": "Subviciciones",
            "start_date": "08-09-2015",
            "duration": "2",
            "parent": "5",
            "progress": 2
        },
        {
            "id": 14,
            "text": "Catalogos",
            "start_date": "08-09-2015",
            "duration": "2",
            "parent": "5",
            "progress": 2
        },
        {
            "id": 15,
            "text": "Mantenimiento general",
            "start_date": "08-09-2015",
            "duration": "2",
            "parent": "5",
            "progress": 2
        },
        {
            "id": 16,
            "text": "Plataforma o ambiente de implementacion en servidores",
            "start_date": "08-09-2015",
            "duration": "2",
            "parent": "5",
            "progress": 2
        },
        {
            "id": 17,
            "text": "Interfases del sistema(Slamcove/Ediserver/Slamweb/Slamsed/Digital/Dashboard)",
            "start_date": "08-09-2015",
            "duration": "2",
            "parent": "5",
            "progress": 2
        },
        {
            "id": 18,
            "text": "Importacion",
            "start_date": "21-09-2015",
            "duration": "2",
            "parent": "6",
            "progress": 2
        }
        ,
        {
            "id": 19,
            "text": "Exportacion",
            "start_date": "21-09-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 20,
            "text": "Importacion",
            "start_date": "21-09-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 21,
            "text": "Ferrocarril",
            "start_date": "21-09-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 22,
            "text": "Aereo",
            "start_date": "22-07-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 23,
            "text": "Maritimo",
            "start_date": "22-07-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 24,
            "text": "Consolidados",
            "start_date": "21-07-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 25,
            "text": "Subdiviciones",
            "start_date": "21-07-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 26,
            "text": "Virtuales",
            "start_date": "22-07-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        },
        {
            "id": 27,
            "text": "Remesas",
            "start_date": "23-07-2015",
            "duration": "1",
            "parent": "6",
            "progress": 0
        }
    ],
    "links": [
		{ "id": "1", "source": "5", "target": "12", "type": "1" },
		{ "id": "2", "source": "5", "target": "13", "type": "1" },
		{ "id": "3", "source": "5", "target": "14", "type": "1" },
		{ "id": "4", "source": "5", "target": "15", "type": "1" },
		{ "id": "5", "source": "5", "target": "16", "type": "1" },
		{ "id": "6", "source": "5", "target": "17", "type": "1" },
		{ "id": "7", "source": "5", "target": "18", "type": "1" },
		{ "id": "8", "source": "6", "target": "19", "type": "1" },
		{ "id": "9", "source": "6", "target": "20", "type": "1" },
		{ "id": "10", "source": "6", "target": "21", "type": "1" },
		{ "id": "11", "source": "6", "target": "22", "type": "1" },
		{ "id": "12", "source": "7", "target": "23", "type": "1" },
		{ "id": "13", "source": "7", "target": "24", "type": "1" }
    ]
};