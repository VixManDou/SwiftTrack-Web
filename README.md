# SwiftTrack Web

SwiftTrack Web es un sistema monolítico MVC en Node.js + Express + EJS con Supabase como base de datos.

## Requisitos
- Node.js 18+ (recomendado)
- Cuenta y proyecto en Supabase

## Instalación

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala dependencias:

```bash
npm install
```

3. Copia `.env.example` a `.env` y configura `SUPABASE_URL` y `SUPABASE_KEY`.

4. Crea la tabla `paquetes` en Supabase (SQL de ejemplo):

```sql
create table if not exists paquetes (
  folio text primary key,
  destino text,
  peso numeric,
  estado text
);

create table if not exists paquete_historial (
  id serial primary key,
  folio text references paquetes(folio),
  fecha date,
  hora time,
  ubicacion text,
  evento text,
  created_at timestamp with time zone default now()
);

insert into paquetes (folio, destino, peso, estado) values ('ST-98231', 'Paquetería Jalisco', 2.5, 'Paquetería Ciudad de México');
```

5. Arranca la aplicación:

```bash
npm start
```

Visita `http://localhost:3000`.

### Notas
- El acceso administrativo está simulado mediante `?rol=admin` en la query string. Ej: `http://localhost:3000/?rol=admin`.
- Reemplaza la simulación por un sistema de autenticación real antes de producción.
