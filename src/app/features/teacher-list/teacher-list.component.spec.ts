import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherListComponent } from './teacher-list.component';
import { TeacherService } from '../../core/services/teacher.service';
import AuthTokenService from '../../core/services/auth-token.service';
import { provideRouter, Router } from '@angular/router';
import { ITeacher } from '../../core/interfaces/teacher.interface';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IResponseTeachers } from '../../core/interfaces/response.teacher.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


fdescribe('TeacherListComponent', () => {
  let component: TeacherListComponent;
  let fixture: ComponentFixture<TeacherListComponent>;
  let teacherServiceSpy: jasmine.SpyObj<TeacherService>;
  let authTokenServiceSpy: jasmine.SpyObj<AuthTokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockTeachers: ITeacher[] = [
    { 
      id: 1, 
      nome: 'Professor A', 
      dataEntrada: '',
      telefone: '123456789', 
      genero: '',
      estadoCivil: '',
      dataNascimento: '',
      email: 'professorA@test.com',
      naturalidade: '',
      cep: '',
      logradouro: '',
      numero: '',
      cidade: '',
      estado: '',
      complemento: '',
      cpf: '',
      rg: '',
      usuario: { 
        id: 1, 
        login: 'usuarioA', 
        nome: 'Usuario A',
        senha: 'senha123', 
        papel: { id: 1, nome: 'Professor' }, 
      }, 
      materias: []
    },
    { 
      id: 2, 
      nome: 'Professor B', 
      dataEntrada: '',
      telefone: '987654321', 
      genero: '',
      estadoCivil: '',
      dataNascimento: '',
      email: 'professorB@test.com',
      naturalidade: '',
      cep: '',
      logradouro: '',
      numero: '',
      cidade: '',
      estado: '',
      complemento: '',
      cpf: '',
      rg: '',
      usuario: { 
        id: 2, 
        login: 'usuarioB', 
        nome: 'Usuario B', 
        senha: 'senha456',
        papel: { id: 1, nome: 'Professor' }
      }, 
      materias: []
    }
  ];
  

  const mockResponse: IResponseTeachers = {
    success: true,
    timestamp: new Date().toISOString(),
    message: 'Professores carregados com sucesso',
    httpStatus: '200',
    docenteData: mockTeachers
  };


  beforeEach(async () => {

    teacherServiceSpy = jasmine.createSpyObj('TeacherService', ['getAllTeachersToken']);
    authTokenServiceSpy = jasmine.createSpyObj('AuthTokenService', ['getToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    teacherServiceSpy.getAllTeachersToken.and.returnValue(of(mockResponse));
    authTokenServiceSpy.getToken.and.returnValue('mockToken');

    await TestBed.configureTestingModule({
      imports: [TeacherListComponent, MatTableModule, MatSnackBarModule, BrowserAnimationsModule], 
      providers: [
        provideRouter([
          { path: 'teacher', component: TeacherListComponent }
        ]), 
        { provide: TeacherService, useValue: teacherServiceSpy },
        { provide: AuthTokenService, useValue: authTokenServiceSpy },
        { provide: Router, useValue: routerSpy },
        MatSnackBar,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar a lista de professores ao inicializar', () => {
    component.ngOnInit();
    expect(authTokenServiceSpy.getToken).toHaveBeenCalled();
    expect(teacherServiceSpy.getAllTeachersToken).toHaveBeenCalledWith('mockToken');
    expect(component.teachers).toEqual(mockTeachers);
    expect(component.filteredTeachers).toEqual(mockTeachers);
  });

  it('deve filtrar a lista de professores com base na pesquisa', () => {
    component.teachers = mockTeachers;
    component.searchQuery = 'Professor A';
    component.filterTeachers();
    expect(component.filteredTeachers.length).toBe(1);
    expect(component.filteredTeachers[0].nome).toBe('Professor A');
  });

  it('deve resetar a lista de professores ao limpar a pesquisa', () => {
    component.teachers = mockTeachers;
    component.searchQuery = '';
    component.filterTeachers();
    expect(component.filteredTeachers).toEqual(mockTeachers);
  });

  it('deve navegar para a página do professor ao chamar viewTeacher', () => {
    component.viewTeacher('1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/teacher'], { queryParams: { id: '1', mode: 'read' } });
  });
});
