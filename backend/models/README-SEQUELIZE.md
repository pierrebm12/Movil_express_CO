# Configuración de Sequelize para tu backend

1. Instala las dependencias necesarias:

```
npm install sequelize mysql2
npm install --save-dev @types/sequelize
```

2. Asegúrate de que el archivo `db.ts` exporta la instancia de Sequelize:

```ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'movil_express_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false
    }
  }
);

export default sequelize;
```

3. Todos los modelos deben importar esta instancia:

```ts
import sequelize from '../db';
```

4. Los modelos deben extender de `Model` y usar `init`:

```ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export class Producto extends Model {}
Producto.init({
  // ...campos...
}, { sequelize, modelName: 'producto', tableName: 'productos', timestamps: false });
```

5. Las asociaciones deben importarse después de definir todos los modelos:

```ts
import './associations';
```

6. Para sincronizar modelos con la base de datos (solo desarrollo):

```ts
sequelize.sync({ alter: true });
```

7. Usa variables de entorno para la conexión en `.env`:

```
DB_NAME=movil_express_db
DB_USER=root
DB_PASS=tu_password
DB_HOST=localhost
```

---

Si tienes errores de tipos, asegúrate de que tu proyecto es TypeScript y que tienes los tipos instalados. Si usas JavaScript puro, puedes omitir los tipos.
