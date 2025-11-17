package com.tarea4.t4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="aviso_adopcion")
public class AvisoAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(name = "fecha_ingreso")
    private String fechaPublicacion;

    @NotNull
    private String sector;

    @NotNull
    private Integer cantidad;

    @NotNull
    private String tipo;

    @NotNull
    private String edad;

    @NotNull
    @Column(name = "unidad_medida")
    private String unidadMedida;

    @NotNull
    private String comuna;

    public AvisoAdopcion() {}

    public AvisoAdopcion(
            String fechaPublicacion,
            String sector,
            Integer cantidad,
            String tipo,
            String edad,
            String comuna
    ) {
        this.fechaPublicacion = fechaPublicacion;
        this.sector = sector;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.edad = edad;
        this.comuna = comuna;
    }

    public Integer getId() {
        return id;
    }

    public String getFechaPublicacion() {
        return fechaPublicacion;
    }

    public String getSector() {
        return sector;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public String getTipo() {
        return tipo;
    }

    public String getEdad() {
        return edad;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public String getComuna() {
        return comuna;
    }
}