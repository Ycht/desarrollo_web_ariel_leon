from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
from datetime import datetime
from math import ceil

# ---- Database Config ----

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# ---- Models ----

class Region(Base):
    __tablename__ = "region"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False, unique=True)

    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = "comuna"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)

    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna")

class AvisoAdopcion(Base):
    __tablename__ = "aviso_adopcion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    tipo = Column(Enum("gato", "perro"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum("a", "m"), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text)

    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso")
    contactos = relationship("ContactarPor", back_populates="aviso")

class Foto(Base):
    __tablename__ = "foto"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso = relationship("AvisoAdopcion", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = "contactar_por"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Enum("whatsapp", "telegram", "X", "instagram", "tiktok", "otra"), nullable=False)
    identificador = Column(String(150), nullable=False)
    actividad_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso = relationship("AvisoAdopcion", back_populates="contactos")


# ---- Database Functions ----

def init_db():
    """
    Crea todas las tablas en la base de datos según los modelos declarados.
    """
    Base.metadata.create_all(bind=engine)

def get_regiones():
    """
    Obtiene todas las regiones ordenadas por nombre.
    Devuelve una lista de objetos Region.
    """
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre).all()
    session.close()
    return regiones

def get_comunas_por_region(region_id):
    """
    Obtiene las comunas pertenecientes a una región específica.
    - region_id: ID de la región
    Devuelve una lista de objetos Comuna.
    """
    session = SessionLocal()
    comunas = session.query(Comuna).filter(Comuna.region_id == region_id).order_by(Comuna.nombre).all()
    session.close()
    return comunas

def create_aviso_adopcion(comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida,
                           fecha_entrega, descripcion, fotos, contactos):
    """
    Crea un aviso de adopción y lo guarda en la base de datos.
    - comuna_id: ID de la comuna
    - sector: Nombre del sector (opcional)
    - nombre, email, celular: Datos del contacto responsable de la publicación
    - tipo: 'gato' o 'perro'
    - cantidad, edad, unidad_medida: Info de la/s mascota/s
    - fecha_entrega: fecha disponible para entrega
    - descripcion: descripción del aviso
    - fotos: lista de diccionarios con keys 'ruta_archivo' y 'nombre_archivo'
    - contactos: lista de diccionarios con keys 'nombre' e 'identificador'
    """
    session = SessionLocal()
    fecha_ingreso = datetime.now()
    aviso = AvisoAdopcion(
        fecha_ingreso=fecha_ingreso,
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad_medida,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion
    )
    # fotos
    for f in fotos:
        # Normalizar slashes para que no hayan problemas según el sistema
        ruta_archivo_normalizada = f["ruta_archivo"].replace("\\", "/")
        aviso.fotos.append(Foto(ruta_archivo=ruta_archivo_normalizada, nombre_archivo=f["nombre_archivo"]))
    
    # contactos
    for c in contactos:
        aviso.contactos.append(ContactarPor(nombre=c["nombre"], identificador=c["identificador"]))

    session.add(aviso)
    session.commit()
    session.close()

def get_avisos(limit=None, page=None, page_size=5):
    """
    Obtiene avisos de adopción con fotos y comuna cargadas.
    - limit: Si está definido, devuelve los últimos 'limit' avisos.
    - page: Si está definido, devuelve avisos paginados según 'page_size'.
    - page_size: cantidad de avisos por página (5 por defecto).
    Devuelve una lista de objetos AvisoAdopcion si se usa limit o una
    tupla (lista de objetos AvisoAdopcion, total_pages) si se usa 'page'
    """
    session = SessionLocal()
    try:
        query = session.query(AvisoAdopcion).options(
            joinedload(AvisoAdopcion.comuna),
            joinedload(AvisoAdopcion.fotos)
        ).order_by(AvisoAdopcion.fecha_ingreso.desc())

        if limit is not None:
            return query.limit(limit).all()
        elif page is not None:
            total = query.count()
            total_pages = ceil(total / page_size)
            avisos = query.offset((page - 1) * page_size).limit(page_size).all()
            return avisos, total_pages
        else:
            return query.all()
    finally:
        session.close()