import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherComponent } from './teacher.component';
import { TeacherService } from '../../core/services/teacher.service';
import AuthTokenService from '../../core/services/auth-token.service';
import {  ViaCepService } from '../../core/services/viacep.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { MatSnackBar, MatSnackBarDismiss, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, provideRouter } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { IResponseTeachers } from '../../core/interfaces/response.teacher.interface';
import { provideHttpClient } from '@angular/common/http';
import { IConfig, NGX_MASK_CONFIG } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('TeacherComponent', () => {
  let component: TeacherComponent;
  let fixture: ComponentFixture<TeacherComponent>;
  let teacherServiceSpy: jasmine.SpyObj<TeacherService>;
  let authTokenServiceSpy: jasmine.SpyObj<AuthTokenService>;
  let viaCepServiceSpy: jasmine.SpyObj<ViaCepService>;
  let enrollmentServiceSpy: jasmine.SpyObj<EnrollmentService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const maskConfig: Partial<IConfig> = { 
    validation: false,
    decimalMarker: '.', 
    thousandSeparator: ',', 
    prefix: '', 
    suffix: '',
    dropSpecialCharacters: true,
    outputTransformFn: (value: string | number | null | undefined): string => {
      return value !== undefined && value !== null ? value.toString() : '';
    }
  };


  const mockResponse: IResponseTeachers = {
    success: true,
    timestamp: new Date().toISOString(),
    message: 'Dados carregados com sucesso',
    httpStatus: '200',
    docenteData: [
      {
        id: 1,  
        nome: 'Professor Teste',
        dataEntrada: '2020-01-01', 
        telefone: '123456789',
        genero: 'Masculino',
        estadoCivil: 'Solteiro',
        dataNascimento: '1985-01-01',
        email: 'professor@test.com',
        cpf: '12345678901',
        rg: '1234567',
        naturalidade: 'Cidade Teste',
        cep: '12345678',
        logradouro: 'Rua Teste',
        numero: '123',
        cidade: 'Cidade Teste',
        estado: 'Estado Teste',
        complemento: 'Complemento Teste',
        usuario: {
          id: 1,
          login: 'usuarioTeste',
          nome: 'Usuário Teste',
          senha: 'senha123',
          papel: { id: 2, nome: 'Professor' }
        },
        materias: []
      }
    ]
  };

  const mockResponseMaterias = {
    success: true,
    timestamp: new Date().toISOString(),
    message: 'Materias carregadas com sucesso',
    httpStatus: '200',
    materiaData: [] 
  };

  beforeEach(async () => {

    teacherServiceSpy = jasmine.createSpyObj('TeacherService', ['getTeacherToken', 'getCreateTeachersToken', 'getUpdateTeachersToken', 'getDeleteTeacherToken']);
    authTokenServiceSpy = jasmine.createSpyObj('AuthTokenService', ['getToken']);
    viaCepServiceSpy = jasmine.createSpyObj('ViaCepService', ['getAddressByCep']);
    enrollmentServiceSpy = jasmine.createSpyObj('EnrollmentService', ['getDisciplinesToken']);

    const snackBarRefStub: Partial<MatSnackBarRef<TextOnlySnackBar>> = {
      afterDismissed: () => of({ dismissedByAction: false } as MatSnackBarDismiss),
    };

    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    snackBarSpy.open.and.returnValue(snackBarRefStub as MatSnackBarRef<TextOnlySnackBar>);

    const paramMapSpy = jasmine.createSpyObj<ParamMap>('ParamMap', ['get', 'getAll', 'has', 'keys']);
    paramMapSpy.get.and.callFake((key: string) => (key === 'id' ? '1' : 'read'));
    

    const activatedRouteSnapshotStub: Partial<ActivatedRouteSnapshot> = {
      queryParamMap: paramMapSpy
    };

    const activatedRouteStub = {
      snapshot: activatedRouteSnapshotStub
    } as Partial<ActivatedRoute>;

    teacherServiceSpy.getTeacherToken.and.returnValue(of(mockResponse));
    teacherServiceSpy.getCreateTeachersToken.and.returnValue(of(mockResponse));
    teacherServiceSpy.getUpdateTeachersToken.and.returnValue(of(mockResponse));
    teacherServiceSpy.getDeleteTeacherToken.and.returnValue(of(mockResponse));
    authTokenServiceSpy.getToken.and.returnValue('mockToken');
    enrollmentServiceSpy.getDisciplinesToken.and.returnValue(of(mockResponseMaterias));

    await TestBed.configureTestingModule({
      imports: [TeacherComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'teacher', component: TeacherComponent }
        ]), 
        { provide: TeacherService, useValue: teacherServiceSpy },
        { provide: AuthTokenService, useValue: authTokenServiceSpy },
        { provide: ViaCepService, useValue: viaCepServiceSpy },
        { provide: EnrollmentService, useValue: enrollmentServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: NGX_MASK_CONFIG, useValue: maskConfig }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário ao iniciar', () => {
    component.ngOnInit();
    expect(component.teacherForm).toBeDefined();
  });

  it('deve carregar os dados do professor se o ID estiver presente', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.teacherForm.get('name')?.value).toBe('Professor Teste');
  });

  it('deve validar CPF corretamente', () => {
    const cpfControl = component.teacherForm.get('cpf') as FormControl;
    cpfControl.setValue('12345678909'); 
    expect(component.cpfValidator(cpfControl)).toBeNull();
  });

  it('deve exibir mensagem de erro se CEP for inválido', () => {
  
    const cepControl = component.teacherForm.get('cep');
    cepControl?.setValue('12345678'); 
    cepControl?.markAsTouched();
    cepControl?.markAsDirty();
    
    viaCepServiceSpy.getAddressByCep.and.returnValue(of({ erro: true } as any));
  
    component.onCepBlur();
    fixture.detectChanges(); 
  
  
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'CEP informado não existe!', 
      'Fechar', 
      { duration: 3000 }
    );
  });

  it('deve salvar os dados do professor', () => {
    component.viewMode = 'insert';
    component.onSave();
    expect(teacherServiceSpy.getCreateTeachersToken).toHaveBeenCalled();
  });

  it('deve atualizar os dados do professor em modo de edição', () => {
    component.teacherId = 1;
    component.viewMode = 'edit';
    component.onSave();
    expect(teacherServiceSpy.getUpdateTeachersToken).toHaveBeenCalled();
  });

  it('deve excluir o professor', () => {
    component.teacherId = 1;
    component.onDelete();
    expect(teacherServiceSpy.getDeleteTeacherToken).toHaveBeenCalledWith(1, 'mockToken');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Docente excluído com sucesso!', 'Fechar', { duration: 3000 });
  });
});